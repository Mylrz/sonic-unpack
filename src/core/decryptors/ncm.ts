import { DecryptResult, MusicMetadata } from '../../types/music';
import { decryptAes128Ecb } from '../crypto/aes';

const NCM_CORE_KEY = new Uint8Array([
  0x68, 0x7a, 0x48, 0x52, 0x41, 0x6d, 0x73, 0x6f, 
  0x35, 0x6b, 0x49, 0x6e, 0x62, 0x61, 0x78, 0x57
]);

const NCM_META_KEY = new Uint8Array([
  0x23, 0x31, 0x34, 0x6c, 0x6a, 0x6b, 0x5f, 0x21, 
  0x5c, 0x5d, 0x26, 0x30, 0x55, 0x3c, 0x27, 0x28
]);

const NCM_MAGIC = [0x43, 0x54, 0x45, 0x4e, 0x46, 0x44, 0x41, 0x4d]; // CTENFDAM

export async function decryptNcm(fileBuffer: ArrayBuffer): Promise<DecryptResult> {
  const dataView = new DataView(fileBuffer);
  const u8Array = new Uint8Array(fileBuffer);

  // 1. Verify Magic Number
  for (let i = 0; i < NCM_MAGIC.length; i++) {
    if (u8Array[i] !== NCM_MAGIC[i]) {
      throw new Error('无效的 NCM 文件：文件头特征码不匹配');
    }
  }

  let offset = 10; // Skip 8-byte magic + 2-byte gap

  // 2. Read Key Length & Key Data
  const keyLen = dataView.getUint32(offset, true);
  offset += 4;

  const rawKeyData = new Uint8Array(keyLen);
  for (let i = 0; i < keyLen; i++) {
    rawKeyData[i] = u8Array[offset + i] ^ 0x64;
  }
  offset += keyLen;

  // Decrypt AES Key
  const decryptedKeyBytes = decryptAes128Ecb(rawKeyData, NCM_CORE_KEY);
  // Strip "neteasecloudmusic" prefix (17 bytes)
  const rc4Key = decryptedKeyBytes.subarray(17);

  // Build S-Box
  const sBox = buildNcmSBox(rc4Key);

  // 3. Read Meta Length & Metadata
  const metaLen = dataView.getUint32(offset, true);
  offset += 4;

  let metadata: MusicMetadata = {
    title: '',
    artist: '',
    album: '',
  };

  if (metaLen > 0) {
    const rawMetaData = new Uint8Array(metaLen);
    for (let i = 0; i < metaLen; i++) {
      rawMetaData[i] = u8Array[offset + i] ^ 0x63;
    }
    offset += metaLen;

    try {
      // Strip "163 key(Don't modify):" prefix (22 bytes)
      const base64Encrypted = rawMetaData.subarray(22);
      const binaryString = String.fromCharCode.apply(null, Array.from(base64Encrypted));
      const encryptedBytes = Uint8Array.from(atob(binaryString), c => c.charCodeAt(0));

      const decryptedMetaBytes = decryptAes128Ecb(encryptedBytes, NCM_META_KEY);
      const metaText = new TextDecoder('utf-8').decode(decryptedMetaBytes);
      
      // Meta JSON usually starts with "music:"
      const jsonStr = metaText.startsWith('music:') ? metaText.substring(6) : metaText;
      const parsed = JSON.parse(jsonStr);

      const artists = Array.isArray(parsed.artist)
        ? parsed.artist.map((item: any) => (Array.isArray(item) ? item[0] : item.name || item)).join(' / ')
        : (parsed.artist || '');

      metadata = {
        title: parsed.musicName || '',
        artist: artists,
        album: parsed.album || '',
        bitrate: parsed.bitrate,
        format: parsed.format,
        duration: parsed.duration ? parsed.duration / 1000 : undefined,
        lyrics: parsed.lyrics,
      };
    } catch (e) {
      console.warn('NCM 元数据解析失败，已忽略元数据:', e);
    }
  }

  // 4. Skip 4-byte CRC or gap + 5-byte padding
  offset += 9; // 4 + 5

  // 5. Read Album Cover Picture
  const imageLen = dataView.getUint32(offset, true);
  offset += 4;

  if (imageLen > 0 && offset + imageLen <= u8Array.length) {
    const imageBytes = u8Array.slice(offset, offset + imageLen);
    const mime = imageBytes[0] === 0x89 ? 'image/png' : 'image/jpeg';
    const coverBlob = new Blob([imageBytes], { type: mime });
    metadata.coverBlob = coverBlob;
    metadata.coverUrl = URL.createObjectURL(coverBlob);
    offset += imageLen;
  }

  // 6. Decrypt Audio Payload
  const audioEncrypted = u8Array.subarray(offset);
  const audioDecrypted = new Uint8Array(audioEncrypted.length);

  for (let i = 0; i < audioEncrypted.length; i++) {
    const j = (i + 1) & 0xff;
    const sBoxVal = sBox[j];
    const index = (sBoxVal + sBox[(sBoxVal + j) & 0xff]) & 0xff;
    audioDecrypted[i] = audioEncrypted[i] ^ sBox[index];
  }

  // 7. Detect Result Audio Format
  const { ext, mimeType } = detectAudioMime(audioDecrypted);

  return {
    rawAudio: audioDecrypted,
    mimeType,
    ext,
    metadata,
  };
}

function buildNcmSBox(key: Uint8Array): Uint8Array {
  const box = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    box[i] = i;
  }

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (box[i] + j + key[i % key.length]) & 0xff;
    const temp = box[i];
    box[i] = box[j];
    box[j] = temp;
  }

  return box;
}

export function detectAudioMime(bytes: Uint8Array): { ext: 'flac' | 'mp3' | 'ogg' | 'wav' | 'm4a'; mimeType: string } {
  // FLAC: 0x66 0x4C 0x61 0x43 (fLaC)
  if (bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43) {
    return { ext: 'flac', mimeType: 'audio/flac' };
  }
  // MP3 ID3v2 tag: 'ID3' -> 0x49 0x44 0x33
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    return { ext: 'mp3', mimeType: 'audio/mpeg' };
  }
  // MP3 Sync Word: 0xFF 0xFB or 0xFF 0xFA or 0xFF 0xF3 or 0xFF 0xF2
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    return { ext: 'mp3', mimeType: 'audio/mpeg' };
  }
  // OGG: 0x4F 0x67 0x67 0x53 (OggS)
  if (bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
    return { ext: 'ogg', mimeType: 'audio/ogg' };
  }
  // WAV: 'RIFF' -> 0x52 0x49 0x46 0x46
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return { ext: 'wav', mimeType: 'audio/wav' };
  }
  // Default to MP3
  return { ext: 'mp3', mimeType: 'audio/mpeg' };
}
