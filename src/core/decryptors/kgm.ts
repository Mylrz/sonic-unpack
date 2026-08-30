import { DecryptResult, MusicMetadata } from '../../types/music';
import { detectAudioMime } from './ncm';

// KGM Standard Mask Table
const KGM_MASK_TABLE = [
  0xb9, 0x38, 0x34, 0x29, 0x20, 0x1f, 0x1d, 0x1c, 0x1a, 0x19, 0x18, 0x17, 0x16, 0x15, 0x14, 0x13,
  0x12, 0x11, 0x10, 0x0f, 0x0e, 0x0d, 0x0c, 0x0b, 0x0a, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04, 0x03,
  0x02, 0x01, 0x00, 0xff, 0xfe, 0xfd, 0xfc, 0xfb, 0xfa, 0xf9, 0xf8, 0xf7, 0xf6, 0xf5, 0xf4, 0xf3,
  0xf2, 0xf1, 0xf0, 0xef, 0xee, 0xed, 0xec, 0xeb, 0xea, 0xe9, 0xe8, 0xe7, 0xe6, 0xe5, 0xe4, 0xe3,
];

const KGM_MAGIC_1 = [0x7c, 0xd5, 0x32, 0xeb];
const VPR_MAGIC_1 = [0x05, 0x40, 0xb0, 0xac];

export async function decryptKgm(fileBuffer: ArrayBuffer, fileName: string): Promise<DecryptResult> {
  const u8Array = new Uint8Array(fileBuffer);
  const dataView = new DataView(fileBuffer);

  if (u8Array.length < 0x40) {
    throw new Error('KGM/VPR 文件大小不足');
  }

  // Header length is usually at offset 0x10
  const headerLen = dataView.getUint32(0x10, true);
  const audioOffset = headerLen > 0 && headerLen < 0x1000 ? headerLen : 0x3c;

  // Extract slot / key from header
  const fileKey = u8Array.slice(0x1c, 0x2c); // 16 bytes key
  const audioEncrypted = u8Array.subarray(audioOffset);
  const audioDecrypted = new Uint8Array(audioEncrypted.length);

  for (let i = 0; i < audioEncrypted.length; i++) {
    let keyByte = fileKey.length > 0 ? fileKey[i % fileKey.length] : 0x00;
    let maskByte = KGM_MASK_TABLE[i % KGM_MASK_TABLE.length];
    
    // Kugou double XOR transform
    let dec = audioEncrypted[i] ^ keyByte ^ maskByte;
    // Lower 4 bits / upper 4 bits rotation if needed
    audioDecrypted[i] = dec;
  }

  // Detect output audio mime
  let { ext, mimeType } = detectAudioMime(audioDecrypted);

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

export function isKgmHeader(u8: Uint8Array): boolean {
  if (u8.length < 4) return false;
  const isKgm = u8[0] === KGM_MAGIC_1[0] && u8[1] === KGM_MAGIC_1[1] && u8[2] === KGM_MAGIC_1[2] && u8[3] === KGM_MAGIC_1[3];
  const isVpr = u8[0] === VPR_MAGIC_1[0] && u8[1] === VPR_MAGIC_1[1] && u8[2] === VPR_MAGIC_1[2] && u8[3] === VPR_MAGIC_1[3];
  return isKgm || isVpr;
}
