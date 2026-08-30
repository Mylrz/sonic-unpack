import React from 'react';
import { AppSettings, PRESET_ACCENTS, SUPPORTED_LANGUAGES, ConflictStrategy } from '../../types/settings';
import { AudioFormat } from '../../types/music';
import { pickDirectory } from '../../utils/fileSystem';
import { directoryWatcher } from '../../core/watcher/directoryWatcher';
import { NAMING_TEMPLATES } from '../../core/organizer/naming';
import { getTranslation } from '../../i18n';
import {
  Sun,
  Moon,
  Laptop,
  Folder,
  Eye,
  Tag,
  Image as ImageIcon,
  FileText,
  FolderOpen,
  FolderSync,
  Check,
  Languages,
  Info,
  Layers,
  Cpu,
  FileCode,
  FolderTree,
  ShieldAlert,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newPartial: Partial<AppSettings>) => void;
  onWatcherTriggerFiles?: (files: File[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onWatcherTriggerFiles,
}) => {
  const t = getTranslation(settings.language);

  const handleSelectOutputDir = async () => {
    const dir = await pickDirectory();
    if (dir) {
      onUpdateSettings({ defaultOutputDir: dir });
    }
  };

  const handleSelectWatchDir = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const handle = await (window as any).showDirectoryPicker();
        if (handle) {
          onUpdateSettings({
            watchDirectoryPath: handle.name,
            enableDirectoryWatcher: true,
          });
          if (onWatcherTriggerFiles) {
            directoryWatcher.startWatch(handle, onWatcherTriggerFiles);
          }
        }
      }
    } catch (e) {
      console.warn('Watch dir pick cancelled:', e);
    }
  };

  const handleToggleWatcher = (enabled: boolean) => {
    onUpdateSettings({ enableDirectoryWatcher: enabled });
    if (!enabled) {
      directoryWatcher.stopWatch();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 w-full select-none animate-fadeIn pb-24">
      {/* Top Header */}
      <div className="pb-4 border-b border-[var(--border-color)] mb-6 max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold text-[var(--text-main)] tracking-tight">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {t.settingsSubtitle}
        </p>
      </div>

      {/* Main Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* ================= LEFT COLUMN: 界面、语言与整理规则 ================= */}
        <div className="space-y-6">
          {/* 1. 语言设置 (Language Selection) */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <Languages className="w-3.5 h-3.5" />
              <span>{t.languageSection}</span>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3.5 shadow-card">
              <p className="text-[11px] text-[var(--text-muted)] mb-3">
                {t.languageDesc}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = settings.language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => onUpdateSettings({ language: lang.id })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-smooth ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] shadow-xs'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-neutral-50 dark:hover:bg-neutral-850 text-[var(--text-muted)]'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{lang.nativeName}</div>
                        <div className="text-[10px] opacity-70">{lang.name}</div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--text-main)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 2. 命名与分级整理规则 (New: Naming & Auto-Folders) */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <FileCode className="w-3.5 h-3.5" />
              <span>{t.namingSection}</span>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)] overflow-hidden shadow-card">
              {/* Naming Template Selector */}
              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-medium text-[var(--text-main)]">
                    {t.namingTemplateLabel}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {t.namingTemplateDesc}
                  </div>
                </div>
                <select
                  value={settings.namingTemplate}
                  onChange={e => onUpdateSettings({ namingTemplate: e.target.value })}
                  className="text-xs bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer"
                >
                  {NAMING_TEMPLATES.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto Organize into Artist/Album Subfolders */}
              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors">
                <div className="flex items-center space-x-2.5 pr-4">
                  <FolderTree className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.autoOrganizeFoldersLabel}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {t.autoOrganizeFoldersDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoOrganizeFolders}
                  onChange={e => onUpdateSettings({ autoOrganizeFolders: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[var(--accent-color)] accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                />
              </label>

              {/* File Conflict Strategy */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 pr-4">
                  <ShieldAlert className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.conflictStrategyLabel}
                    </div>
                  </div>
                </div>
                <select
                  value={settings.conflictStrategy}
                  onChange={e =>
                    onUpdateSettings({ conflictStrategy: e.target.value as ConflictStrategy })
                  }
                  className="text-xs bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer"
                >
                  <option value="rename">{t.conflictRename}</option>
                  <option value="overwrite">{t.conflictOverwrite}</option>
                  <option value="skip">{t.conflictSkip}</option>
                </select>
              </div>
            </div>
          </section>

          {/* 3. 外观模式 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>{t.appearanceSection}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: t.themeLight, icon: <Sun className="w-4 h-4" /> },
                { id: 'dark', label: t.themeDark, icon: <Moon className="w-4 h-4" /> },
                { id: 'system', label: t.themeSystem, icon: <Laptop className="w-4 h-4" /> },
              ].map(themeOpt => {
                const isSelected = settings.theme === themeOpt.id;
                return (
                  <button
                    key={themeOpt.id}
                    onClick={() => onUpdateSettings({ theme: themeOpt.id as any })}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-medium transition-smooth ${
                      isSelected
                        ? 'border-[var(--accent-color)] bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] shadow-xs'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-neutral-50 dark:hover:bg-neutral-850 text-[var(--text-muted)]'
                    }`}
                  >
                    {themeOpt.icon}
                    <span>{themeOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. 强调色 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                {t.accentColorSection}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PRESET_ACCENTS.map(accent => {
                const isSelected = settings.accentColorId === accent.id;
                return (
                  <button
                    key={accent.id}
                    onClick={() =>
                      onUpdateSettings({
                        accentColorId: accent.id,
                        customAccentHex: undefined,
                      })
                    }
                    className={`p-2.5 rounded-xl border flex flex-col items-center space-y-2 text-center transition-smooth ${
                      isSelected
                        ? 'border-[var(--accent-color)] bg-neutral-100 dark:bg-neutral-800 shadow-xs'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-neutral-50 dark:hover:bg-neutral-850'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: accent.value }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-[11px] text-[var(--text-main)] truncate max-w-full font-medium">
                      {accent.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN: 转换策略、标签与自动化 ================= */}
        <div className="space-y-6">
          {/* 5. 转换参数设置 */}
          <section className="space-y-3">
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {t.conversionSection}
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)] overflow-hidden shadow-card">
              {/* Default Format */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="pr-4">
                  <div className="text-xs font-medium text-[var(--text-main)]">
                    {t.defaultFormatLabel}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {t.defaultFormatDesc}
                  </div>
                </div>
                <select
                  value={settings.defaultOutputFormat}
                  onChange={e =>
                    onUpdateSettings({ defaultOutputFormat: e.target.value as AudioFormat })
                  }
                  className="text-xs bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 outline-hidden cursor-pointer flex-shrink-0"
                >
                  <option value="AUTO">{t.formatAuto}</option>
                  <option value="MP3">{t.formatMp3}</option>
                  <option value="FLAC">{t.formatFlac}</option>
                  <option value="OGG">{t.formatOgg}</option>
                  <option value="WAV">{t.formatWav}</option>
                </select>
              </div>

              {/* Default Output Folder */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="pr-4">
                  <div className="text-xs font-medium text-[var(--text-main)]">
                    {t.defaultOutputFolderLabel}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                    {settings.defaultOutputDir}
                  </div>
                </div>
                <button
                  onClick={handleSelectOutputDir}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-main)] transition-smooth flex-shrink-0"
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>{t.changeFolderBtn}</span>
                </button>
              </div>
            </div>
          </section>

          {/* 6. 元数据与选项 */}
          <section className="space-y-3">
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {t.tagsSection}
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)] overflow-hidden shadow-card">
              {/* Keep Tags */}
              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors">
                <div className="flex items-center space-x-2.5 pr-4">
                  <Tag className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.keepMetadataLabel}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {t.keepMetadataDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.keepMetadata}
                  onChange={e => onUpdateSettings({ keepMetadata: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[var(--accent-color)] accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                />
              </label>

              {/* Keep Cover */}
              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors">
                <div className="flex items-center space-x-2.5 pr-4">
                  <ImageIcon className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.keepCoverLabel}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {t.keepCoverDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.keepCoverArt}
                  onChange={e => onUpdateSettings({ keepCoverArt: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[var(--accent-color)] accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                />
              </label>

              {/* Export LRC */}
              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors">
                <div className="flex items-center space-x-2.5 pr-4">
                  <FileText className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.exportLrcLabel}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {t.exportLrcDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.exportLrc}
                  onChange={e => onUpdateSettings({ exportLrc: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[var(--accent-color)] accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                />
              </label>

              {/* Auto Open Folder */}
              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors">
                <div className="flex items-center space-x-2.5 pr-4">
                  <FolderOpen className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.autoOpenFolderLabel}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {t.autoOpenFolderDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoOpenFolderOnFinish}
                  onChange={e => onUpdateSettings({ autoOpenFolderOnFinish: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[var(--accent-color)] accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                />
              </label>
            </div>
          </section>

          {/* 7. 目录监听 */}
          <section className="space-y-3">
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {t.watcherSection}
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3.5 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 pr-4">
                  <FolderSync className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-[var(--text-main)]">
                      {t.enableWatcherLabel}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {t.enableWatcherDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableDirectoryWatcher}
                  onChange={e => handleToggleWatcher(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-[var(--accent-color)] accent-[var(--accent-color)] cursor-pointer flex-shrink-0"
                />
              </div>

              {settings.enableDirectoryWatcher && (
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="text-xs font-mono text-[var(--text-muted)] truncate mr-2">
                    {t.watchPathLabel}: {settings.watchDirectoryPath || t.watchPathUnset}
                  </div>
                  <button
                    onClick={handleSelectWatchDir}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-main)] transition-smooth flex-shrink-0"
                  >
                    {t.selectWatchDirBtn}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 8. 关于与系统信息卡片 */}
          <section className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              <Info className="w-3.5 h-3.5" />
              <span>{t.aboutSection}</span>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 shadow-card space-y-3 text-xs">
              <p className="text-[var(--text-muted)] leading-relaxed">
                {t.aboutDesc}
              </p>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[var(--text-muted)]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{t.engineStatusTitle}</span>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  {t.engineStatusReady}
                </span>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)]">
                <div className="flex items-center space-x-2 text-[var(--text-muted)] mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t.supportedFormatsTitle}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['NCM', 'QMC0', 'QMC3', 'QMCFLAC', 'QMCOGG', 'MFLAC', 'MGG', 'KGM', 'VPR', 'KWM'].map(
                    fmt => (
                      <span
                        key={fmt}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)] border border-black/[0.04]"
                      >
                        .{fmt.toLowerCase()}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
