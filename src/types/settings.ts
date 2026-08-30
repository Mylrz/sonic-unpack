import { AudioFormat } from './music';

export type ThemeMode = 'light' | 'dark' | 'system';

export type SupportedLanguage = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP' | 'ko-KR';

export type ConflictStrategy = 'rename' | 'overwrite' | 'skip';

export interface LanguageOption {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { id: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
  { id: 'en-US', name: '英语', nativeName: 'English' },
  { id: 'ja-JP', name: '日语', nativeName: '日本語' },
  { id: 'ko-KR', name: '韩语', nativeName: '한국어' },
];

export interface AccentColor {
  id: string;
  name: string;
  value: string;
  hover: string;
  fg: string;
  previewBg: string;
}

export interface AppSettings {
  theme: ThemeMode;
  language: SupportedLanguage;
  accentColorId: string;
  customAccentHex?: string;
  defaultOutputFormat: AudioFormat;
  defaultOutputDir: string;
  keepMetadata: boolean;
  keepCoverArt: boolean;
  exportLrc: boolean;
  autoOpenFolderOnFinish: boolean;
  enableDirectoryWatcher: boolean;
  watchDirectoryPath?: string;
  
  // 1. 命名与分目录整理
  namingTemplate: string; // e.g. '{artist} - {title}', '{title} - {artist}', '{title}', '{album}/{artist} - {title}'
  autoOrganizeFolders: boolean; // 按 歌手/专辑 分级创建文件夹
  
  // 2. 冲突策略
  conflictStrategy: ConflictStrategy; // 'rename' | 'overwrite' | 'skip'
}

export const PRESET_ACCENTS: AccentColor[] = [
  {
    id: 'graphite',
    name: '极简石墨',
    value: '#18181B',
    hover: '#27272A',
    fg: '#FFFFFF',
    previewBg: 'bg-zinc-900 dark:bg-zinc-100',
  },
  {
    id: 'slate-blue',
    name: '静谧克莱因蓝',
    value: '#2563EB',
    hover: '#1D4ED8',
    fg: '#FFFFFF',
    previewBg: 'bg-blue-600',
  },
  {
    id: 'sage-green',
    name: '鼠尾草绿',
    value: '#059669',
    hover: '#047857',
    fg: '#FFFFFF',
    previewBg: 'bg-emerald-600',
  },
  {
    id: 'warm-amber',
    name: '暖木琥珀',
    value: '#D97706',
    hover: '#B45309',
    fg: '#FFFFFF',
    previewBg: 'bg-amber-600',
  },
  {
    id: 'iris-purple',
    name: '低调鸢尾紫',
    value: '#7C3AED',
    hover: '#6D28D9',
    fg: '#FFFFFF',
    previewBg: 'bg-purple-600',
  },
  {
    id: 'titanium-gray',
    name: '深空钛灰',
    value: '#4B5563',
    hover: '#374151',
    fg: '#FFFFFF',
    previewBg: 'bg-gray-600',
  },
];
