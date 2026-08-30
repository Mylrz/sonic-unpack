import React, { useState } from 'react';
import { HistoryRecord } from '../../types/music';
import { formatBytes, formatDateTime } from '../../utils/format';
import { revealFileLocation } from '../../utils/fileSystem';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation, formatString } from '../../i18n';
import { Search, Trash2, Download, Folder, Music, Music2 } from 'lucide-react';

interface HistoryListProps {
  history: HistoryRecord[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  language?: SupportedLanguage;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onRemove,
  onClear,
  onExport,
  language = 'zh-CN',
}) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item => {
    const query = searchQuery.toLowerCase();
    const title = item.metadata?.title?.toLowerCase() || '';
    const artist = item.metadata?.artist?.toLowerCase() || '';
    const fileName = item.fileName.toLowerCase();
    return title.includes(query) || artist.includes(query) || fileName.includes(query);
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-6 md:p-8 select-none animate-fadeIn max-w-7xl w-full mx-auto">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)] mb-4 flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-main)]">
            {t.historyTitle}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {formatString(t.historySummary, { count: history.length })}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] outline-hidden focus:border-neutral-400 dark:focus:border-neutral-600 transition-smooth"
            />
          </div>

          {/* Export JSON */}
          {history.length > 0 && (
            <button
              onClick={onExport}
              title={t.exportHistory}
              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-smooth cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Clear History */}
          {history.length > 0 && (
            <button
              onClick={onClear}
              title={t.clearHistory}
              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-neutral-400 hover:text-rose-500 transition-smooth cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* History Items Container */}
      {filteredHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[var(--text-muted)] mb-3 opacity-60">
            <Music2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-[var(--text-main)]">
            {searchQuery ? t.emptySearchTitle : t.emptyHistoryTitle}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {searchQuery ? t.emptySearchDesc : t.emptyHistoryDesc}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-6">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3.5 shadow-card hover:shadow-card-hover transition-smooth flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-black/[0.04] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.metadata?.coverUrl ? (
                    <img
                      src={item.metadata.coverUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-4 h-4 text-[var(--text-muted)] opacity-60" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-[var(--text-main)] truncate">
                      {item.metadata?.title || item.fileName}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)]">
                        {item.originalFormat}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">→</span>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-neutral-200/70 dark:bg-neutral-700 text-[var(--text-main)]">
                        {item.outputFormat}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] mt-0.5">
                    <span className="truncate max-w-[150px]">
                      {item.metadata?.artist || t.unknownArtist}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{formatBytes(item.size)}</span>
                    <span>•</span>
                    <span>{formatDateTime(item.convertedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  onClick={() => revealFileLocation(item.savePath, item.outputFileName)}
                  className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-smooth cursor-pointer"
                  title={t.locateFile}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>{t.locateFile}</span>
                </button>

                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-smooth cursor-pointer"
                  title={t.deleteRecord}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
