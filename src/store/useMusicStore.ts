import { useState, useCallback } from 'react';
import { AudioFormat, ConvertedItem, HistoryRecord } from '../types/music';
import { AppSettings } from '../types/settings';
import { detectFormat } from '../core/detector';
import { processConversion } from '../core/converter/audioEngine';
import { downloadBlob } from '../utils/fileSystem';

export function useMusicStore() {
  const [items, setItems] = useState<ConvertedItem[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const newItems: ConvertedItem[] = [];

    for (const file of newFiles) {
      // Read first 16 bytes for quick format detection
      const slice = await file.slice(0, 16).arrayBuffer();
      const headerBytes = new Uint8Array(slice);
      const originalFormat = detectFormat(file, headerBytes);
      const ext = file.name.split('.').pop() || '';

      const item: ConvertedItem = {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        originalExt: ext.toUpperCase(),
        originalFormat,
        size: file.size,
        targetFormat: 'AUTO',
        status: 'ready',
        progress: 0,
      };

      newItems.push(item);
    }

    setItems(prev => [...prev, ...newItems]);
  }, []);

  const updateItemTargetFormat = useCallback((id: string, targetFormat: AudioFormat) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, targetFormat } : item)));
  }, []);

  const batchSetTargetFormat = useCallback((targetFormat: AudioFormat) => {
    setItems(prev =>
      prev.map(item => (item.status !== 'completed' ? { ...item, targetFormat } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setOverallProgress(0);
  }, []);

  const startConversion = useCallback(
    async (settings: AppSettings, onRecordSuccess?: (record: HistoryRecord) => void) => {
      if (isConverting) return;

      const readyItems = items.filter(i => i.status === 'ready' || i.status === 'failed');
      if (readyItems.length === 0) return;

      setIsConverting(true);
      setOverallProgress(0);

      let finishedCount = 0;
      const totalCount = readyItems.length;

      // Process in queue
      for (const item of readyItems) {
        // Mark decoding
        setItems(prev =>
          prev.map(it => (it.id === item.id ? { ...it, status: 'decoding', progress: 10 } : it))
        );

        try {
          const result = await processConversion(item, settings, progressVal => {
            setItems(prev =>
              prev.map(it =>
                it.id === item.id
                  ? {
                      ...it,
                      progress: progressVal,
                      status: progressVal >= 60 ? 'converting' : 'decoding',
                    }
                  : it
              )
            );
          });

          // Mark completed
          setItems(prev =>
            prev.map(it =>
              it.id === item.id
                ? {
                    ...it,
                    status: 'completed',
                    progress: 100,
                    outputBlob: result.outputBlob,
                    outputFileName: result.outputFileName,
                    outputRelativePath: result.outputRelativePath,
                    outputUrl: result.outputUrl,
                    metadata: result.metadata,
                    quality: result.quality,
                    lrcBlob: result.lrcBlob,
                    lrcFileName: result.lrcFileName,
                    convertedAt: Date.now(),
                  }
                : it
            )
          );

          // Auto trigger individual download if enabled and not in batch ZIP mode
          downloadBlob(result.outputBlob, result.outputFileName);
          if (result.lrcBlob && result.lrcFileName) {
            downloadBlob(result.lrcBlob, result.lrcFileName);
          }

          // Emit record to history
          if (onRecordSuccess) {
            const historyRec: HistoryRecord = {
              id: item.id,
              fileName: item.name,
              originalFormat: item.originalFormat,
              outputFormat: result.outputFileName.split('.').pop()?.toUpperCase() || 'MP3',
              size: result.outputBlob.size,
              outputFileName: result.outputFileName,
              convertedAt: Date.now(),
              quality: result.quality,
              metadata: {
                title: result.metadata.title || item.name,
                artist: result.metadata.artist || '未知歌手',
                album: result.metadata.album || '未知专辑',
                coverUrl: result.metadata.coverUrl,
              },
              savePath: settings.defaultOutputDir,
              audioUrl: result.outputUrl,
            };
            onRecordSuccess(historyRec);
          }
        } catch (err: any) {
          console.error(`转换失败 (${item.name}):`, err);
          setItems(prev =>
            prev.map(it =>
              it.id === item.id
                ? {
                    ...it,
                    status: 'failed',
                    errorMessage: err?.message || '未知错误，解密失败',
                  }
                : it
            )
          );
        }

        finishedCount++;
        setOverallProgress(Math.round((finishedCount / totalCount) * 100));
      }

      setIsConverting(false);
    },
    [isConverting, items]
  );

  const completedCount = items.filter(i => i.status === 'completed').length;
  const failedCount = items.filter(i => i.status === 'failed').length;

  return {
    items,
    isConverting,
    overallProgress,
    completedCount,
    failedCount,
    addFiles,
    updateItemTargetFormat,
    batchSetTargetFormat,
    removeItem,
    clearAll,
    startConversion,
  };
}
