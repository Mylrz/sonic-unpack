import React, { useRef, useState } from 'react';
import { UploadCloud, FolderPlus } from 'lucide-react';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation } from '../../i18n';

import { extractFilesFromDataTransfer } from '../../utils/folderScanner';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  language?: SupportedLanguage;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, language = 'zh-CN' }) => {
  const t = getTranslation(language);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const files = await extractFilesFromDataTransfer(e.dataTransfer.items);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onFilesSelected(fileList);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full max-w-2xl h-80 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-smooth ${
          isDragOver
            ? 'border-[var(--accent-color)] bg-neutral-100/70 dark:bg-neutral-800/70 scale-[0.99]'
            : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          // @ts-ignore
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Minimal Icon */}
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 text-[var(--text-main)] shadow-xs transition-transform group-hover:scale-105">
          <UploadCloud className="w-8 h-8 opacity-80" />
        </div>

        {/* Primary Prompt */}
        <h2 className="text-lg font-semibold text-[var(--text-main)] tracking-tight mb-1.5">
          {t.dropTitle}
        </h2>

        {/* Secondary Subtitle */}
        <p className="text-xs text-[var(--text-muted)] mb-5">
          {t.dropSubtitle}
        </p>

        {/* Supported Formats Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md">
          {['NCM', 'QMC', 'MFLAC', 'MGG', 'KGM', 'VPR', 'KWM'].map(tag => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)] border border-black/[0.04] dark:border-white/[0.04]"
            >
              .{tag.toLowerCase()}
            </span>
          ))}
          <span className="text-[11px] text-[var(--text-muted)] px-1">→</span>
          {['FLAC', 'MP3', 'OGG'].map(tag => (
            <span
              key={tag}
              className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-neutral-200/80 dark:bg-neutral-700 text-[var(--text-main)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Auxiliary folder upload button */}
      <div className="mt-4 flex items-center space-x-3 text-xs text-[var(--text-muted)]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            folderInputRef.current?.click();
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-smooth"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>{t.selectFolder}</span>
        </button>
      </div>
    </div>
  );
};
