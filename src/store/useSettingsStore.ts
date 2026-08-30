import { useState, useEffect } from 'react';
import { AppSettings, PRESET_ACCENTS } from '../types/settings';

const STORAGE_KEY = 'sonic_unpack_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  accentColorId: 'graphite',
  defaultOutputFormat: 'AUTO',
  defaultOutputDir: '默认下载目录',
  keepMetadata: true,
  keepCoverArt: true,
  exportLrc: false,
  autoOpenFolderOnFinish: true,
  enableDirectoryWatcher: false,
  namingTemplate: '{artist} - {title}',
  autoOrganizeFolders: false,
  conflictStrategy: 'rename',
};

export function useSettingsStore() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newPartial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Sync theme & accent colors to HTML DOM root
  useEffect(() => {
    const root = document.documentElement;

    // 1. Theme class (light / dark)
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. Language attribute on HTML tag
    root.setAttribute('lang', settings.language);

    // 3. Accent color variables
    const currentAccent = PRESET_ACCENTS.find(a => a.id === settings.accentColorId) || PRESET_ACCENTS[0];
    const accentHex = settings.customAccentHex || currentAccent.value;
    const accentHover = currentAccent.hover;
    const accentFg = currentAccent.fg;

    root.style.setProperty('--accent-color', accentHex);
    root.style.setProperty('--accent-hover', accentHover);
    root.style.setProperty('--accent-fg', accentFg);
  }, [settings.theme, settings.language, settings.accentColorId, settings.customAccentHex]);

  return {
    settings,
    updateSettings,
  };
}
