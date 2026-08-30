import React from 'react';
import { Minus, Square, X, Music } from 'lucide-react';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation } from '../../i18n';

interface TitleBarProps {
  language?: SupportedLanguage;
}

export const TitleBar: React.FC<TitleBarProps> = ({ language = 'zh-CN' }) => {
  const t = getTranslation(language);
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

  const handleMinimize = () => {
    if ((window as any).electronAPI?.minimizeWindow) {
      (window as any).electronAPI.minimizeWindow();
      return;
    }
    if ((window as any).__TAURI__) {
      (window as any).__TAURI__.window?.getCurrentWindow?.()?.minimize?.();
    }
  };

  const handleMaximize = () => {
    if ((window as any).electronAPI?.maximizeWindow) {
      (window as any).electronAPI.maximizeWindow();
      return;
    }
    if ((window as any).__TAURI__) {
      (window as any).__TAURI__.window?.getCurrentWindow?.()?.toggleMaximize?.();
    }
  };

  const handleClose = () => {
    if ((window as any).electronAPI?.closeWindow) {
      (window as any).electronAPI.closeWindow();
      return;
    }
    if ((window as any).__TAURI__) {
      (window as any).__TAURI__.window?.getCurrentWindow?.()?.close?.();
    }
  };

  return (
    <div
      className="h-10 w-full flex items-center justify-between px-4 select-none border-b border-[var(--border-color)] bg-[var(--bg-surface)] transition-colors duration-200 flex-shrink-0"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* Left side */}
      <div className="flex items-center space-x-2.5">
        {isMac ? (
          <div className="flex items-center space-x-2 mr-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity cursor-pointer" onClick={handleClose} />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity cursor-pointer" onClick={handleMinimize} />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity cursor-pointer" onClick={handleMaximize} />
          </div>
        ) : null}

        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-[var(--accent-color)] text-[var(--accent-fg)] flex items-center justify-center shadow-xs">
            <Music className="w-3 h-3" />
          </div>
          <span className="text-xs font-medium tracking-tight text-[var(--text-main)] opacity-90">
            {t.appName}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)] font-mono">
            {t.version}
          </span>
        </div>
      </div>

      {/* Right side (Windows Controls if not Mac) */}
      {!isMac && (
        <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={handleMinimize}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500 hover:text-white text-[var(--text-muted)] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
