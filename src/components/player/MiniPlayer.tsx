import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/format';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Disc,
} from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="w-full bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-4 py-2.5 shadow-modal flex items-center justify-between gap-4 select-none animate-fadeIn transition-colors duration-200 z-30">
      {/* 1. Left: Track info, Cover, Quality Badge */}
      <div className="flex items-center space-x-3 min-w-0 w-1/4">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 border border-black/[0.04] flex items-center justify-center">
          {currentTrack.coverUrl ? (
            <img
              src={currentTrack.coverUrl}
              alt="Cover"
              className={`w-full h-full object-cover ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
              style={{ animationDuration: '8s' }}
            />
          ) : (
            <Disc
              className={`w-5 h-5 text-[var(--text-muted)] ${
                isPlaying ? 'animate-spin-slow text-[var(--accent-color)]' : 'opacity-60'
              }`}
              style={{ animationDuration: '6s' }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5">
            <h4
              className="text-xs font-semibold text-[var(--text-main)] truncate"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </h4>
            {currentTrack.quality?.badge && (
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  currentTrack.quality.isHiRes
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : currentTrack.quality.isLossless
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)]'
                }`}
              >
                {currentTrack.quality.badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
            {currentTrack.artist}
            {currentTrack.quality?.sampleRateText ? ` • ${currentTrack.quality.sampleRateText}` : ''}
            {currentTrack.quality?.bitDepthText ? ` • ${currentTrack.quality.bitDepthText}` : ''}
          </p>
        </div>
      </div>

      {/* 2. Center: Controls & Scrubber */}
      <div className="flex-1 max-w-xl flex flex-col items-center space-y-1">
        {/* Play/Pause & Time */}
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-mono text-[var(--text-muted)] w-10 text-right">
            {formatDuration(currentTime)}
          </span>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-[var(--accent-color)] text-[var(--accent-fg)] flex items-center justify-center shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <span className="text-[10px] font-mono text-[var(--text-muted)] w-10">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Scrubber Bar */}
        <div className="w-full flex items-center group relative cursor-pointer py-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={e => seek(parseFloat(e.target.value))}
            className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)] outline-hidden"
          />
        </div>
      </div>

      {/* 3. Right: Volume & Close */}
      <div className="flex items-center justify-end space-x-3 w-1/4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)] outline-hidden"
          />
        </div>

        <button
          onClick={closePlayer}
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-smooth"
          title="关闭播放器"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
