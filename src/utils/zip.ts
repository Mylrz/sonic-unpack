import JSZip from 'jszip';
import { ConvertedItem } from '../types/music';

/**
 * Packages all completed audio files (and companion LRC files) into a single ZIP archive
 */
export async function packageAndDownloadZip(
  items: ConvertedItem[],
  zipName: string = `SonicUnpack_Music_${Date.now()}.zip`,
  onProgress?: (percent: number) => void
): Promise<void> {
  const completedItems = items.filter(i => i.status === 'completed' && i.outputBlob);
  if (completedItems.length === 0) return;

  const zip = new JSZip();

  for (const item of completedItems) {
    if (!item.outputBlob) continue;

    // Use relative path to preserve artist/album folder structure if enabled
    const path = item.outputRelativePath || item.outputFileName || `${item.name}.mp3`;
    const arrayBuf = await item.outputBlob.arrayBuffer();
    zip.file(path, arrayBuf);

    // Companion LRC file
    if (item.lrcBlob && item.lrcFileName) {
      const lrcBuf = await item.lrcBlob.arrayBuffer();
      const lrcPath = item.outputRelativePath
        ? item.outputRelativePath.replace(/\.[^/.]+$/, '.lrc')
        : item.lrcFileName;
      zip.file(lrcPath, lrcBuf);
    }
  }

  onProgress?.(30);

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    metadata => {
      onProgress?.(30 + Math.floor(metadata.percent * 0.7));
    }
  );

  onProgress?.(100);

  // Trigger download
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
