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
  // 1. Electron Desktop Native integration
  if ((window as any).electronAPI?.revealInFolder) {
    try {
      await (window as any).electronAPI.revealInFolder(folderPath || fileName);
      return;
    } catch (e) {
      console.warn('Electron reveal failed:', e);
    }
  }

  // 2. Tauri desktop integration:
  if ((window as any).__TAURI__) {
    try {
      const { invoke } = (window as any).__TAURI__.core || (window as any).__TAURI__.tauri;
      await invoke('reveal_in_folder', { path: folderPath || '' });
      return;
    } catch (e) {
      console.warn('Tauri reveal_in_folder failed:', e);
    }
  }

  // 3. Web fallback: Notify user
  const message = fileName 
    ? `文件已保存至下载目录：${fileName}`
    : `文件已保存至默认下载目录`;
  alert(message);
}

/**
 * Pick a directory using Electron Native Dialog or File System Access API
 */
export async function pickDirectory(): Promise<string | null> {
  // 1. Electron Native directory picker
  if ((window as any).electronAPI?.selectDirectory) {
    try {
      const selected = await (window as any).electronAPI.selectDirectory();
      if (selected) return selected;
    } catch (e) {
      console.warn('Electron select directory error:', e);
    }
  }

  // 2. Web File System Access API
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
