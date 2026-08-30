import { DecryptResult, MusicMetadata } from '../../types/music';
import { detectAudioMime } from './ncm';

const QMC_STATIC_MAP = [
  0x77, 0x48, 0x32, 0x43, 0x47, 0x39, 0x34, 0x66, 0x6B, 0x62, 0x78, 0x55, 0x48, 0x40, 0x35, 0x64,
  0x61, 0x6D, 0x55, 0x4F, 0x42, 0x45, 0x31, 0x35, 0x30, 0x35, 0x6D, 0x38, 0x4D, 0x49, 0x6E, 0x6F,
  0x54, 0x48, 0x7A, 0x34, 0x41, 0x32, 0x69, 0x66, 0x31, 0x7A, 0x54, 0x6A, 0x71, 0x72, 0x63, 0x36,
  0x6B, 0x66, 0x56, 0x62, 0x6E, 0x6D, 0x6C, 0x6B, 0x6A, 0x69, 0x68, 0x67, 0x66, 0x65, 0x64, 0x63,
  0x62, 0x61, 0x7A, 0x79, 0x78, 0x77, 0x76, 0x75, 0x74, 0x73, 0x72, 0x71, 0x70, 0x6F, 0x6E, 0x6D,
  0x6C, 0x6B, 0x6A, 0x69, 0x68, 0x67, 0x66, 0x65, 0x64, 0x63, 0x62, 0x61, 0x7A, 0x79, 0x78, 0x77,
  0x76, 0x75, 0x74, 0x73, 0x72, 0x71, 0x70, 0x6F, 0x6E, 0x6D, 0x6C, 0x6B, 0x6A, 0x69, 0x68, 0x67,
  0x66, 0x65, 0x64, 0x63, 0x62, 0x61, 0x7A, 0x79, 0x78, 0x77, 0x76, 0x75, 0x74, 0x73, 0x72, 0x71
];

export async function decryptQmc(fileBuffer: ArrayBuffer, fileName: string): Promise<DecryptResult> {
  const u8Array = new Uint8Array(fileBuffer);
  let audioBytes = u8Array;
  
  // Check for QMCv2 / Tail embedded key
  // If file ends with key length (4 bytes uint32 big/little endian) and tag
  let audioLen = u8Array.length;
  if (u8Array.length > 4) {
    const view = new DataView(fileBuffer);
    const tail4 = view.getUint32(audioLen - 4, true);
    // Check if tail is a reasonable key length (usually < 1024 bytes)
    if (tail4 > 0 && tail4 < 1024 && audioLen > tail4 + 4) {
      // Possible QMCv2 with tail key
      const keyOffset = audioLen - 4 - tail4;
      const tailKeyBytes = u8Array.subarray(keyOffset, audioLen - 4);
      const isKeyAscii = tailKeyBytes.every(b => b >= 32 && b <= 126);
      if (isKeyAscii) {
        audioLen = keyOffset;
        audioBytes = u8Array.subarray(0, audioLen);
      }
    }
  }

  const decrypted = new Uint8Array(audioLen);

  // Decrypt using QMC Seed / Static Map algorithm
  for (let i = 0; i < audioLen; i++) {
    let mask: number;
    let idx = i;
    if (idx > 0x7fff) {
      idx %= 0x7fff;
    }
    const seedVal = (idx * idx + 80923) % 256;
    const mapVal = QMC_STATIC_MAP[idx % QMC_STATIC_MAP.length];
    mask = seedVal ^ mapVal;
    decrypted[i] = audioBytes[i] ^ mask;
  }

  // Detect output audio mime
  let { ext, mimeType } = detectAudioMime(decrypted);

  // If MIME detection defaults to MP3, check filename hint (e.g. .qmcflac or .mflac -> flac, .qmcogg or .mgg -> ogg)
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith('.qmcflac') || lowerName.endsWith('.mflac')) {
    ext = 'flac';
    mimeType = 'audio/flac';
  } else if (lowerName.endsWith('.qmcogg') || lowerName.endsWith('.mgg')) {
    ext = 'ogg';
    mimeType = 'audio/ogg';
  }

  const baseTitle = fileName.replace(/\.[^/.]+$/, '');
  const metadata: MusicMetadata = {
    title: baseTitle,
    artist: '',
    album: '',
  };

  return {
    rawAudio: decrypted,
    mimeType,
    ext,
    metadata,
  };
}
