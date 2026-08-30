import React from 'react';
import { ConvertedItem, AudioFormat } from '../../types/music';
import { formatBytes } from '../../utils/format';
import { revealFileLocation } from '../../utils/fileSystem';
import { SupportedLanguage } from '../../types/settings';
import { getTranslation } from '../../i18n';
import { usePlayer } from '../../context/PlayerContext';
import { Music, Play, Folder, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface MusicCardProps {
  item: ConvertedItem;
  onFormatChange: (id: string, format: AudioFormat) => void;
  onRemove: (id: string) => void;
  language?: SupportedLanguage;
}

export const MusicCard: React.FC<MusicCardProps> = ({
  item,
  onFormatChange,
  onRemove,
  language = 'zh-CN',
}) => {
  const t = getTranslation(language);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const isCompleted = item.status === 'completed';
  const isFailed = item.status === 'failed';
  const isProcessing = item.status === 'decoding' || item.status === 'converting';
  const isCurrentlyPlaying = currentTrack?.id === item.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.outputUrl) {
      playTrack({
        id: item.id,
        title: item.metadata?.title || item.outputFileName || item.name,
        artist: item.metadata?.artist || t.unknownArtist,
        album: item.metadata?.album,
        coverUrl: item.metadata?.coverUrl,
        audioUrl: item.outputUrl,
        quality: item.quality,
      });
    }
  };

  return (
    <div
      onClick={isCompleted && item.outputUrl ? handlePlay : undefined}
      className={`relative group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-3 shadow-card hover:shadow-card-hover transition-smooth flex items-center justify-between gap-3 select-none ${
        isCompleted ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700' : ''
      }`}
    >
      {/* Left: Cover Art & Basic Info */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        {/* Cover Art thumbnail */}
        <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-black/[0.04] dark:border-white/[0.04] flex-shrink-0 overflow-hidden flex items-center justify-center">
          {item.metadata?.coverUrl ? (
            <img
              src={item.metadata.coverUrl}
              alt="Cover"
              className={`w-full h-full object-cover ${isCurrentlyPlaying ? 'animate-pulse' : ''}`}
            />
          ) : (
            <Music className="w-5 h-5 text-[var(--text-muted)] opacity-60" />
          )}

          {isCompleted && item.outputUrl && (
            <button
              onClick={handlePlay}
              className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white transition-opacity ${
                isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              title={t.actionListen}
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          )}
        </div>

        {/* Title, Artist & Format badges */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <h4
              className="text-sm font-medium text-[var(--text-main)] truncate"
              title={item.metadata?.title || item.name}
            >
              {item.metadata?.title || item.name}
            </h4>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)] border border-black/[0.04]">
              {item.originalFormat}
            </span>

            {/* Audio Quality Badge */}
            {item.quality && (
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  item.quality.isHiRes
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : item.quality.isLossless
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)]'
                }`}
                title={`${item.quality.sampleRateText || ''} ${item.quality.bitDepthText || ''} ${item.quality.bitrateText || ''}`}
              >
                {item.quality.badge}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
            <span className="truncate max-w-[140px]">
              {item.metadata?.artist || t.unknownArtist}
            </span>
            <span>•</span>
            <span className="font-mono">{formatBytes(item.size)}</span>
            {item.outputRelativePath && item.outputRelativePath !== item.outputFileName && (
              <>
                <span>•</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[120px]" title={item.outputRelativePath}>
                  {item.outputRelativePath}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center / Right: Output format selection & Status */}
      <div className="flex items-center space-x-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
        {/* Output Format Select */}
        <div className="flex flex-col items-end space-y-1">
          <select
            disabled={isProcessing || isCompleted}
            value={item.targetFormat}
            onChange={e => onFormatChange(item.id, e.target.value as AudioFormat)}
            className="text-xs bg-neutral-100 dark:bg-neutral-800 text-[var(--text-main)] border border-[var(--border-color)] rounded-lg px-2 py-1 outline-hidden hover:bg-neutral-150 transition-smooth cursor-pointer disabled:opacity-50 disabled:cursor-default"
          >
            <option value="AUTO">{t.formatAuto}</option>
            <option value="MP3">{t.formatMp3}</option>
            <option value="FLAC">{t.formatFlac}</option>
            <option value="OGG">{t.formatOgg}</option>
            <option value="WAV">{t.formatWav}</option>
          </select>
        </div>

        {/* Status indicator / actions */}
        <div className="min-w-[120px] flex items-center justify-end">
          {item.status === 'ready' && (
            <span className="text-xs text-[var(--text-muted)] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
              {t.statusReady}
            </span>
          )}

          {isProcessing && (
            <div className="flex items-center space-x-1.5 text-xs text-[var(--text-main)]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-color)]" />
              <span className="font-mono">{item.progress}%</span>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center space-x-1.5 animate-fadeIn">
              <span className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mr-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.statusCompleted}</span>
              </span>

              {/* Action: Open file / Open folder */}
              <button
                onClick={handlePlay}
                title={t.actionListen}
                className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => revealFileLocation(undefined, item.outputFileName)}
                title={t.actionOpenFolder}
                className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <Folder className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isFailed && (
            <div className="flex items-center space-x-1 text-xs text-rose-500" title={item.errorMessage}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="truncate max-w-[80px]">{t.statusFailed}</span>
            </div>
          )}
        </div>

        {/* Delete single item button */}
        {!isProcessing && (
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-smooth cursor-pointer"
            title={t.actionRemove}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Mini Progress Bar for this card */}
      {isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-[var(--accent-color)] transition-all duration-150 ease-out"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
