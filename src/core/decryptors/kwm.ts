import { DecryptResult, MusicMetadata } from '../../types/music';
import { detectAudioMime } from './ncm';

// Kuwo static key mask
const KWM_MASK_KEY = [
  0x79, 0x65, 0x65, 0x6c, 0x69, 0x6f, 0x6e, 0x2d,
  0x6b, 0x75, 0x77, 0x6f, 0x2d, 0x74, 0x6d, 0x65
];

export async function decryptKwm(fileBuffer: ArrayBuffer, fileName: string): Promise<DecryptResult> {
  const u8Array = new Uint8Array(fileBuffer);
  
  // Kuwo header usually 0x400 (1024 bytes)
  const headerOffset = u8Array.length > 0x400 ? 0x400 : 0x18;
  const audioEncrypted = u8Array.subarray(headerOffset);
  const audioDecrypted = new Uint8Array(audioEncrypted.length);

  for (let i = 0; i < audioEncrypted.length; i++) {
    const mask = KWM_MASK_KEY[i % KWM_MASK_KEY.length];
    audioDecrypted[i] = audioEncrypted[i] ^ mask;
  }

  // Detect output audio mime
  const { ext, mimeType } = detectAudioMime(audioDecrypted);

  const baseTitle = fileName.replace(/\.[^/.]+$/, '');
  const metadata: MusicMetadata = {
    title: baseTitle,
    artist: '',
    album: '',
  };

  return {
    rawAudio: audioDecrypted,
    mimeType,
    ext,
    metadata,
  };
}

export function isKwmHeader(u8: Uint8Array): boolean {
  if (u8.length < 8) return false;
  // 'ykkw' -> 0x79 0x6b 0x6b 0x77
  return u8[0] === 0x79 && u8[1] === 0x6b && u8[2] === 0x6b && u8[3] === 0x77;
}
