import { AudioQualityInfo } from '../../types/music';

/**
 * Inspects decrypted audio stream header to determine bit depth, sample rate, and quality tier
 */
export function inspectAudioQuality(
  bytes: Uint8Array,
  ext: string,
  metaBitrate?: number
): AudioQualityInfo {
  if (ext === 'flac' && bytes.length >= 42) {
    try {
      // Check 'fLaC' magic
      if (bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43) {
        // STREAMINFO block starts at offset 4
        // Bytes 18, 19, 20 contain sample rate (20 bits), channels (3 bits), bits per sample (5 bits)
        const b18 = bytes[18];
        const b19 = bytes[19];
        const b20 = bytes[20];

        const sampleRate = (b18 << 12) | (b19 << 4) | (b20 >> 4);
        const bitDepth = (((b20 & 0x01) << 4) | (bytes[21] >> 4)) + 1; // 5 bits

        const isHiRes = bitDepth >= 24 || sampleRate >= 88200;
        const badge = isHiRes ? 'Hi-Res' : 'Lossless';

        return {
          badge,
          sampleRate,
          sampleRateText: formatSampleRate(sampleRate),
          bitDepth,
          bitDepthText: `${bitDepth}-bit`,
          isLossless: true,
          isHiRes,
        };
      }
    } catch {
      // Fallback
    }

    return {
      badge: 'Lossless',
      sampleRate: 44100,
      sampleRateText: '44.1 kHz',
      bitDepth: 16,
      bitDepthText: '16-bit',
      isLossless: true,
      isHiRes: false,
    };
  }

  if (ext === 'mp3') {
    // Check bitrate
    const bitrate = metaBitrate || 320000;
    const is320k = bitrate >= 320000;
    const bitrateKbps = Math.round(bitrate / 1000);

    return {
      badge: is320k ? '320K' : 'Standard',
      bitrate,
      bitrateText: `${bitrateKbps} kbps`,
      sampleRate: 44100,
      sampleRateText: '44.1 kHz',
      isLossless: false,
      isHiRes: false,
    };
  }

  if (ext === 'wav' && bytes.length >= 44) {
    try {
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const sampleRate = view.getUint32(24, true);
      const bitDepth = view.getUint16(34, true);
      const isHiRes = bitDepth >= 24 || sampleRate >= 88200;
      return {
        badge: isHiRes ? 'Hi-Res' : 'Lossless',
        sampleRate,
        sampleRateText: formatSampleRate(sampleRate),
        bitDepth,
        bitDepthText: `${bitDepth}-bit`,
        isLossless: true,
        isHiRes,
      };
    } catch {
      // Fallback
    }
  }

  // Default fallback
  return {
    badge: 'Standard',
    sampleRate: 44100,
    sampleRateText: '44.1 kHz',
    isLossless: false,
    isHiRes: false,
  };
}

function formatSampleRate(rate: number): string {
  if (rate >= 1000) {
    const khz = (rate / 1000).toFixed(1).replace(/\.0$/, '');
    return `${khz} kHz`;
  }
  return `${rate} Hz`;
}
