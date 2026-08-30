import React, { useRef } from 'react';
import { ConvertedItem, AudioFormat } from '../../types/music';
import { MusicCard } from './MusicCard';
import { Plus } from 'lucide-react';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation } from '../../i18n';

interface MusicListProps {
  items: ConvertedItem[];
  onFormatChange: (id: string, format: AudioFormat) => void;
  onRemove: (id: string) => void;
  onAddMore: (files: File[]) => void;
  isConverting: boolean;
  language?: SupportedLanguage;
}

export const MusicList: React.FC<MusicListProps> = ({
  items,
  onFormatChange,
  onRemove,
  onAddMore,
  isConverting,
  language = 'zh-CN',
}) => {
  const t = getTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddMore(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 select-none max-w-7xl w-full mx-auto">
      {/* Top action bar in list view */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-[var(--text-main)]">
            {t.listTitle}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            ({items.length} {t.fileCount})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
          <button
            disabled={isConverting}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-main)] transition-smooth disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addFiles}</span>
          </button>
        </div>
      </div>

      {/* Scrollable list of cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-24">
        {items.map(item => (
          <MusicCard
            key={item.id}
            item={item}
            onFormatChange={onFormatChange}
            onRemove={onRemove}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};
