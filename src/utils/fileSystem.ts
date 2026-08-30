/**
 * Triggers browser download for a Blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Opens and plays the audio in a new tab/player
 */
export function playAudioUrl(url: string) {
  const audio = new Audio(url);
  audio.play().catch(e => {
    console.warn('Auto play failed, opening in new window:', e);
    window.open(url, '_blank');
  });
}

/**
 * Open file location / Reveal in folder helper
 */
export async function revealFileLocation(folderPath?: string, fileName?: string) {
  // If running in Tauri desktop environment:
  if ((window as any).__TAURI__) {
    try {
      const { invoke } = (window as any).__TAURI__.core || (window as any).__TAURI__.tauri;
      await invoke('reveal_in_folder', { path: folderPath || '' });
      return;
    } catch (e) {
      console.warn('Tauri reveal_in_folder failed:', e);
    }
  }

  // Web fallback: Notify user or open default downloads
  const message = fileName 
    ? `文件已保存至下载目录：${fileName}`
    : `文件已保存至默认下载目录`;
  alert(message);
}

/**
 * Pick a directory using modern File System Access API if supported
 */
export async function pickDirectory(): Promise<string | null> {
  try {
    if ('showDirectoryPicker' in window) {
      const handle = await (window as any).showDirectoryPicker();
      return handle.name;
    }
  } catch (e) {
    console.warn('Directory picker cancelled or unsupported:', e);
  }
  return null;
}
