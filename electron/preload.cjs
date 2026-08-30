const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  revealInFolder: (path) => ipcRenderer.invoke('reveal-in-folder', path),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
  isElectron: true,
  platform: process.platform,
});
