export type AudioFormat = 'AUTO' | 'MP3' | 'FLAC' | 'OGG' | 'WAV' | 'AAC';

export type SupportedSourceFormat = 
  | 'NCM' 
  | 'QMC' 
  | 'QMC0' 
  | 'QMC3' 
  | 'QMCFLAC' 
  | 'QMCOGG' 
  | 'MFLAC' 
  | 'MGG' 
  | 'KGM' 
  | 'VPR' 
  | 'KWM'
  | 'UNKNOWN';

export type TaskStatus = 'ready' | 'decoding' | 'converting' | 'completed' | 'failed';

export interface AudioQualityInfo {
  badge: 'Hi-Res' | 'Lossless' | '320K' | 'Standard';
  sampleRate?: number;
  sampleRateText?: string;
  bitDepth?: number;
  bitDepthText?: string;
  bitrate?: number;
  bitrateText?: string;
  isLossless: boolean;
  isHiRes: boolean;
}

export interface MusicMetadata {
  title: string;
  artist: string;
  album: string;
  duration?: number;
  bitrate?: number;
  format?: string;
  coverUrl?: string;
  coverBlob?: Blob;
  lyrics?: string;
  quality?: AudioQualityInfo;
}

export interface ConvertedItem {
  id: string;
  file: File;
  name: string;
  originalExt: string;
  originalFormat: SupportedSourceFormat;
  size: number;
  targetFormat: AudioFormat;
  status: TaskStatus;
  progress: number; // 0 - 100
  metadata?: MusicMetadata;
  quality?: AudioQualityInfo;
  outputBlob?: Blob;
  outputFileName?: string;
  outputRelativePath?: string; // e.g. "周杰伦/叶惠美/晴天.flac"
  outputUrl?: string;
  lrcBlob?: Blob;
  lrcFileName?: string;
  errorMessage?: string;
  convertedAt?: number;
}

export interface DecryptResult {
  rawAudio: Uint8Array;
  mimeType: string;
  ext: 'flac' | 'mp3' | 'ogg' | 'wav' | 'm4a';
  metadata: MusicMetadata;
  quality?: AudioQualityInfo;
}

export interface HistoryRecord {
  id: string;
  fileName: string;
  originalFormat: string;
  outputFormat: string;
  size: number;
  outputFileName: string;
  convertedAt: number;
  duration?: number;
  quality?: AudioQualityInfo;
  metadata?: {
    title: string;
    artist: string;
    album: string;
    coverUrl?: string;
  };
  savePath?: string;
  audioUrl?: string;
}
