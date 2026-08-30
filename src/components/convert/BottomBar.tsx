import React, { useState } from 'react';
import { AudioFormat, ConvertedItem } from '../../types/music';
import { Play, Trash2, CheckCircle2, RotateCw, Archive } from 'lucide-react';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation, formatString } from '../../i18n';
import { packageAndDownloadZip } from '../../utils/zip';

interface BottomBarProps {
  items: ConvertedItem[];
  totalCount: number;
  completedCount: number;
  failedCount: number;
  isConverting: boolean;
  overallProgress: number;
  onBatchFormatChange: (format: AudioFormat) => void;
  onClearAll: () => void;
  onStartConvert: () => void;
  language?: SupportedLanguage;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  items,
  totalCount,
  completedCount,
  failedCount,
  isConverting,
  overallProgress,
  onBatchFormatChange,
  onClearAll,
  onStartConvert,
  language = 'zh-CN',
}) => {
  const t = getTranslation(language);
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const handleDownloadZip = async () => {
    if (completedCount === 0 || isZipping) return;
    setIsZipping(true);
    setZipProgress(10);
    try {
      await packageAndDownloadZip(items, `SonicUnpack_Music_${Date.now()}.zip`, p => {
        setZipProgress(p);
      });
    } catch (e) {
      console.error('ZIP packaging failed:', e);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)]/95 backdrop-blur-md z-10 transition-all select-none">
      <div className="max-w-7xl mx-auto">
        {/* Overall Progress bar when converting or zipping */}
        {(isConverting || isZipping) && (
          <div className="mb-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>
                {isZipping
                  ? `正在打包 ZIP (${zipProgress}%)`
                  : `${t.convertingStatus} (${completedCount}/${totalCount})`}
              </span>
              <span>{isZipping ? `${zipProgress}%` : `${overallProgress}%`}</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-color)] transition-all duration-200 ease-out"
                style={{ width: `${isZipping ? zipProgress : overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Main control toolbar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Batch format select & Clear all */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1.5 text-xs text-[var(--text-muted)]">
              <span>{t.batchFormatLabel}</span>
              <select
                disabled={isConverting}
                onChange={e => onBatchFormatChange(e.target.value as AudioFormat)}
                className="text-xs bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 outline-hidden hover:bg-neutral-150 transition-smooth cursor-pointer disabled:opacity-50"
              >
                <option value="AUTO">{t.formatAuto}</option>
                <option value="MP3">{t.formatMp3}</option>
                <option value="FLAC">{t.formatFlac}</option>
                <option value="OGG">{t.formatOgg}</option>
                <option value="WAV">{t.formatWav}</option>
              </select>
            </div>

            <button
              disabled={isConverting}
              onClick={onClearAll}
              className="flex items-center space-x-1 text-xs text-neutral-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2.5 py-1.5 rounded-lg transition-smooth disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearList}</span>
            </button>
          </div>

          {/* Right: Summary info, ZIP Download & Primary Action Button */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-[var(--text-muted)] font-mono text-right hidden sm:block">
              {isAllCompleted ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{formatString(t.allCompletedSummary, { completed: completedCount })}</span>
                </span>
              ) : (
                <span>{formatString(t.completedSummary, { completed: completedCount, total: totalCount })}</span>
              )}
              {failedCount > 0 && (
                <span className="text-rose-500 ml-2">({failedCount} {t.failedCountSuffix})</span>
              )}
            </div>

            {/* ZIP Package Button when items are completed */}
            {completedCount > 0 && (
              <button
                disabled={isZipping || isConverting}
                onClick={handleDownloadZip}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-main)] transition-smooth cursor-pointer disabled:opacity-50"
                title="将已转换完成的音乐与歌词打包下载为 ZIP 压缩包"
              >
                {isZipping ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Archive className="w-3.5 h-3.5" />
                )}
                <span>{t.btnDownloadZip}</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              disabled={isConverting || totalCount === 0 || isAllCompleted}
              onClick={onStartConvert}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-medium transition-smooth bg-[var(--accent-color)] text-[var(--accent-fg)] hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isConverting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>{t.btnConverting}</span>
                </>
              ) : isAllCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.btnFinished}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.btnStartConvert}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
