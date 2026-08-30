import { MusicMetadata } from '../../types/music';

/**
 * Builds an ID3v2.3 tag header and frames, and prepends to raw MP3 stream if not already tagged
 */
export function injectId3Tags(
  mp3Bytes: Uint8Array,
  metadata: MusicMetadata,
  coverBytes?: Uint8Array
): Uint8Array {
  // If no metadata and no cover, return original
  if (!metadata.title && !metadata.artist && !metadata.album && !coverBytes) {
    return mp3Bytes;
  }

  // Build frames
  const frames: Uint8Array[] = [];

  if (metadata.title) {
    frames.push(createId3TextFrame('TIT2', metadata.title));
  }
  if (metadata.artist) {
    frames.push(createId3TextFrame('TPE1', metadata.artist));
  }
  if (metadata.album) {
    frames.push(createId3TextFrame('TALB', metadata.album));
  }
  if (coverBytes && coverBytes.length > 0) {
    frames.push(createId3PictureFrame(coverBytes));
  }

  if (frames.length === 0) {
    return mp3Bytes;
  }

  const totalFramesLen = frames.reduce((acc, f) => acc + f.length, 0);
  const tagHeader = new Uint8Array(10);
  tagHeader[0] = 0x49; // 'I'
  tagHeader[1] = 0x44; // 'D'
  tagHeader[2] = 0x33; // '3'
  tagHeader[3] = 0x03; // Version 2.3.0
  tagHeader[4] = 0x00;
  tagHeader[5] = 0x00; // Flags

  // Encode syncsafe integer for length
  encodeSyncsafe(totalFramesLen, tagHeader, 6);

  // If source already has an ID3 tag at the beginning, strip it first
  let audioStart = 0;
  if (mp3Bytes[0] === 0x49 && mp3Bytes[1] === 0x44 && mp3Bytes[2] === 0x33) {
    const existingSize = decodeSyncsafe(mp3Bytes, 6);
    audioStart = 10 + existingSize;
  }

  const cleanAudio = mp3Bytes.subarray(audioStart);
  const result = new Uint8Array(10 + totalFramesLen + cleanAudio.length);
  result.set(tagHeader, 0);

  let offset = 10;
  for (const frame of frames) {
    result.set(frame, offset);
    offset += frame.length;
  }
  result.set(cleanAudio, offset);

  return result;
}

function createId3TextFrame(id: string, text: string): Uint8Array {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  // Frame format: ID(4) + Size(4) + Flags(2) + EncodingByte(1) + String
  const frameBodyLen = 1 + textBytes.length;
  const frame = new Uint8Array(10 + frameBodyLen);

  for (let i = 0; i < 4; i++) {
    frame[i] = id.charCodeAt(i);
  }

  // Size (4 bytes uint32 big endian)
  frame[4] = (frameBodyLen >> 24) & 0xff;
  frame[5] = (frameBodyLen >> 16) & 0xff;
  frame[6] = (frameBodyLen >> 8) & 0xff;
  frame[7] = frameBodyLen & 0xff;

  frame[8] = 0x00;
  frame[9] = 0x00; // Flags

  frame[10] = 0x03; // UTF-8 encoding
  frame.set(textBytes, 11);

  return frame;
}

function createId3PictureFrame(coverBytes: Uint8Array): Uint8Array {
  const mime = coverBytes[0] === 0x89 ? 'image/png' : 'image/jpeg';
  const mimeBytes = new TextEncoder().encode(mime);
  // Encoding(1) + MIME string + NullTerminator(1) + PictureType(1 = Front Cover 0x03) + Description(0x00) + ImageBytes
  const bodyLen = 1 + mimeBytes.length + 1 + 1 + 1 + coverBytes.length;
  const frame = new Uint8Array(10 + bodyLen);

  const id = 'APIC';
  for (let i = 0; i < 4; i++) {
    frame[i] = id.charCodeAt(i);
  }

  frame[4] = (bodyLen >> 24) & 0xff;
  frame[5] = (bodyLen >> 16) & 0xff;
  frame[6] = (bodyLen >> 8) & 0xff;
  frame[7] = bodyLen & 0xff;

  frame[8] = 0x00;
  frame[9] = 0x00;

  let offset = 10;
  frame[offset++] = 0x00; // ISO-8859-1 for MIME string
  frame.set(mimeBytes, offset);
  offset += mimeBytes.length;
  frame[offset++] = 0x00; // Null terminator
  frame[offset++] = 0x03; // Picture type: Cover (front)
  frame[offset++] = 0x00; // Description null byte
  frame.set(coverBytes, offset);

  return frame;
}

function encodeSyncsafe(val: number, buffer: Uint8Array, offset: number) {
  buffer[offset] = (val >> 21) & 0x7f;
  buffer[offset + 1] = (val >> 14) & 0x7f;
  buffer[offset + 2] = (val >> 7) & 0x7f;
  buffer[offset + 3] = val & 0x7f;
}

function decodeSyncsafe(buffer: Uint8Array, offset: number): number {
  return (
    ((buffer[offset] & 0x7f) << 21) |
    ((buffer[offset + 1] & 0x7f) << 14) |
    ((buffer[offset + 2] & 0x7f) << 7) |
    (buffer[offset + 3] & 0x7f)
  );
}
