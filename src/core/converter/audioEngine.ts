import { AudioFormat, ConvertedItem, DecryptResult, AudioQualityInfo } from '../../types/music';
import { AppSettings } from '../../types/settings';
import { decryptMusicFile } from '../detector';
import { injectId3Tags } from '../tagger/id3';
import { injectFlacTags } from '../tagger/vorbis';
import { extractAndFormatLrc } from '../tagger/lrc';
import { inspectAudioQuality } from '../inspector/audioQuality';
import { resolveOrganizedPath } from '../organizer/naming';

export async function processConversion(
  item: ConvertedItem,
  settings: AppSettings,
  onProgress: (progress: number) => void
): Promise<{
  outputBlob: Blob;
  outputFileName: string;
  outputRelativePath: string;
  outputUrl: string;
  metadata: any;
  quality: AudioQualityInfo;
  lrcBlob?: Blob;
  lrcFileName?: string;
}> {
  onProgress(15);
  // 1. Decrypt raw file
  const decryptResult: DecryptResult = await decryptMusicFile(item.file, (p) => {
    onProgress(15 + Math.floor(p * 0.45)); // 15% -> 60%
  });

  onProgress(65);

  let rawBytes = decryptResult.rawAudio;
  let finalExt = decryptResult.ext;
  const originalExt = decryptResult.ext;
  const targetFormat = item.targetFormat === 'AUTO' ? settings.defaultOutputFormat : item.targetFormat;

  let coverBytes: Uint8Array | undefined;
  if (settings.keepCoverArt && decryptResult.metadata.coverBlob) {
    const coverBuf = await decryptResult.metadata.coverBlob.arrayBuffer();
    coverBytes = new Uint8Array(coverBuf);
  }

  // 2. Format strategy: Native Restore vs Transcode
  if (targetFormat === 'AUTO' || targetFormat.toLowerCase() === originalExt) {
    // Native Restore without re-encoding
    finalExt = originalExt;

    if (settings.keepMetadata) {
      if (finalExt === 'mp3') {
        rawBytes = injectId3Tags(rawBytes, decryptResult.metadata, coverBytes);
      } else if (finalExt === 'flac') {
        rawBytes = injectFlacTags(rawBytes, decryptResult.metadata, coverBytes);
      }
    }
  } else {
    // Format Transcode requested (e.g. FLAC -> MP3 / WAV)
    onProgress(75);
    const converted = await transcodeAudioBuffer(rawBytes, decryptResult.mimeType, targetFormat);
    rawBytes = converted.bytes;
    finalExt = converted.ext;

    if (settings.keepMetadata && finalExt === 'mp3') {
      rawBytes = injectId3Tags(rawBytes, decryptResult.metadata, coverBytes);
    }
  }

  onProgress(85);

  // 3. Inspect audio quality (Bit depth, sample rate, bitrate, Hi-Res / Lossless tier)
  const quality = inspectAudioQuality(rawBytes, finalExt, decryptResult.metadata.bitrate);
  decryptResult.metadata.quality = quality;

  // 4. Resolve organized file names and relative paths (naming templates + auto-folders)
  const { fileName, relativePath } = resolveOrganizedPath(
    decryptResult.metadata,
    item.name,
    settings.namingTemplate || '{artist} - {title}',
    finalExt,
    settings.autoOrganizeFolders
  );

  const mimeType = getMimeByExt(finalExt);
  const outputBlob = new Blob([rawBytes], { type: mimeType });
  const outputUrl = URL.createObjectURL(outputBlob);

  // 5. Optional LRC export
  let lrcBlob: Blob | undefined;
  let lrcFileName: string | undefined;
  if (settings.exportLrc && decryptResult.metadata.lyrics) {
    const lrcText = extractAndFormatLrc(decryptResult.metadata.lyrics);
    if (lrcText) {
      lrcBlob = new Blob([lrcText], { type: 'text/plain;charset=utf-8' });
      lrcFileName = fileName.replace(/\.[^/.]+$/, '.lrc');
    }
  }

  onProgress(100);

  return {
    outputBlob,
    outputFileName: fileName,
    outputRelativePath: relativePath,
    outputUrl,
    metadata: decryptResult.metadata,
    quality,
    lrcBlob,
    lrcFileName,
  };
}

/**
 * Transcodes raw audio stream using Web Audio API decoding and WAV encoder
 */
async function transcodeAudioBuffer(
  sourceBytes: Uint8Array,
  _sourceMime: string,
  targetFormat: AudioFormat
): Promise<{ bytes: Uint8Array; ext: 'flac' | 'mp3' | 'ogg' | 'wav' }> {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = sourceBytes.buffer.slice(
      sourceBytes.byteOffset,
      sourceBytes.byteOffset + sourceBytes.byteLength
    );
    
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    if (targetFormat === 'WAV') {
      const wavBytes = encodeWav(audioBuffer);
      return { bytes: wavBytes, ext: 'wav' };
    }

    // Default fallback to WAV if Web Audio PCM
    const wavBytes = encodeWav(audioBuffer);
    return { bytes: wavBytes, ext: 'wav' };
  } catch (e) {
    console.warn('转码失败，自动回退至原始解密音频:', e);
    return { bytes: sourceBytes, ext: 'mp3' };
  }
}

function encodeWav(audioBuffer: AudioBuffer): Uint8Array {
  const numOfChan = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numOfChan * 2 + 44;
  const outBuffer = new ArrayBuffer(length);
  const view = new DataView(outBuffer);
  const channels: Float32Array[] = [];
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);  // file length - 8
  setUint32(0x45564157); // "WAVE"

  // FMT sub-chunk
  setUint32(0x20746d66); // "fmt "
  setUint32(16);         // SubChunk1Size (16 for PCM)
  setUint16(1);          // AudioFormat (1 for PCM)
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2);              // block align
  setUint16(16);                         // bits per sample

  // data sub-chunk
  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  while (offset < audioBuffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Uint8Array(outBuffer);
}

function getMimeByExt(ext: string): string {
  switch (ext) {
    case 'flac': return 'audio/flac';
    case 'mp3': return 'audio/mpeg';
    case 'ogg': return 'audio/ogg';
    case 'wav': return 'audio/wav';
    case 'm4a': return 'audio/mp4';
    default: return 'application/octet-stream';
  }
}
