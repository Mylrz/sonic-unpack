import { MusicMetadata } from '../../types/music';

/**
 * Injects Vorbis Comments and Picture block into a raw FLAC byte array
 */
export function injectFlacTags(
  flacBytes: Uint8Array,
  metadata: MusicMetadata,
  coverBytes?: Uint8Array
): Uint8Array {
  // Check if starts with 'fLaC' (0x66 0x4C 0x61 0x43)
  if (
    flacBytes.length < 4 ||
    flacBytes[0] !== 0x66 ||
    flacBytes[1] !== 0x4c ||
    flacBytes[2] !== 0x61 ||
    flacBytes[3] !== 0x43
  ) {
    return flacBytes;
  }

  // If no new metadata and no cover, return original
  if (!metadata.title && !metadata.artist && !metadata.album && !coverBytes) {
    return flacBytes;
  }

  try {
    // Build Vorbis Comment block
    const vorbisBlock = buildVorbisCommentBlock(metadata);
    // Build Picture block if present
    const pictureBlock = coverBytes && coverBytes.length > 0 ? buildFlacPictureBlock(coverBytes) : null;

    // Scan existing blocks to locate after STREAMINFO (block 0)
    let offset = 4;
    let streamInfoEnd = 4;
    let isLast = false;

    while (offset < flacBytes.length && !isLast) {
      const headerByte = flacBytes[offset];
      isLast = (headerByte & 0x80) !== 0;
      const blockType = headerByte & 0x7f;
      const blockLen = (flacBytes[offset + 1] << 16) | (flacBytes[offset + 2] << 8) | flacBytes[offset + 3];

      offset += 4 + blockLen;
      if (blockType === 0) {
        // STREAMINFO
        streamInfoEnd = offset;
        break;
      }
    }

    // New blocks to insert
    const newBlocks: Uint8Array[] = [vorbisBlock];
    if (pictureBlock) {
      newBlocks.push(pictureBlock);
    }

    // Calculate total new size
    const newBlocksLen = newBlocks.reduce((acc, b) => acc + b.length, 0);
    const result = new Uint8Array(flacBytes.length + newBlocksLen);

    // Copy up to STREAMINFO
    result.set(flacBytes.subarray(0, streamInfoEnd), 0);
    // Clear the isLast flag on STREAMINFO if it was set
    result[4] = result[4] & 0x7f;

    // Insert new blocks
    let insertOffset = streamInfoEnd;
    for (const block of newBlocks) {
      result.set(block, insertOffset);
      insertOffset += block.length;
    }

    // Append rest of the original FLAC stream
    result.set(flacBytes.subarray(streamInfoEnd), insertOffset);

    return result;
  } catch (e) {
    console.warn('FLAC 元数据注入失败，保留原始音频数据:', e);
    return flacBytes;
  }
}

function buildVorbisCommentBlock(metadata: MusicMetadata): Uint8Array {
  const encoder = new TextEncoder();
  const vendor = encoder.encode('SonicUnpack FLAC Tagger');
  
  const comments: string[] = [];
  if (metadata.title) comments.push(`TITLE=${metadata.title}`);
  if (metadata.artist) comments.push(`ARTIST=${metadata.artist}`);
  if (metadata.album) comments.push(`ALBUM=${metadata.album}`);
  if (metadata.lyrics) comments.push(`LYRICS=${metadata.lyrics}`);

  const commentByteArrays = comments.map(c => encoder.encode(c));

  // Vorbis body: VendorLen(4) + Vendor + CommentCount(4) + (Len(4) + Comment)*
  let bodyLen = 4 + vendor.length + 4;
  for (const cb of commentByteArrays) {
    bodyLen += 4 + cb.length;
  }

  const block = new Uint8Array(4 + bodyLen);
  // Header: not last (0x00) | BlockType 4 (VORBIS_COMMENT) = 0x04
  block[0] = 0x04;
  block[1] = (bodyLen >> 16) & 0xff;
  block[2] = (bodyLen >> 8) & 0xff;
  block[3] = bodyLen & 0xff;

  let offset = 4;
  // Vendor length (uint32 little endian in Vorbis!)
  block[offset++] = vendor.length & 0xff;
  block[offset++] = (vendor.length >> 8) & 0xff;
  block[offset++] = (vendor.length >> 16) & 0xff;
  block[offset++] = (vendor.length >> 24) & 0xff;
  block.set(vendor, offset);
  offset += vendor.length;

  // Comments count (uint32 little endian)
  const count = commentByteArrays.length;
  block[offset++] = count & 0xff;
  block[offset++] = (count >> 8) & 0xff;
  block[offset++] = (count >> 16) & 0xff;
  block[offset++] = (count >> 24) & 0xff;

  for (const cb of commentByteArrays) {
    block[offset++] = cb.length & 0xff;
    block[offset++] = (cb.length >> 8) & 0xff;
    block[offset++] = (cb.length >> 16) & 0xff;
    block[offset++] = (cb.length >> 24) & 0xff;
    block.set(cb, offset);
    offset += cb.length;
  }

  return block;
}

function buildFlacPictureBlock(coverBytes: Uint8Array): Uint8Array {
  const mime = coverBytes[0] === 0x89 ? 'image/png' : 'image/jpeg';
  const mimeBytes = new TextEncoder().encode(mime);

  // Picture block format (big endian):
  // Type(4) = 3 (Cover Front)
  // MimeLen(4) + Mime
  // DescLen(4) + Desc(0)
  // Width(4), Height(4), ColorDepth(4), Colors(4)
  // DataLen(4) + Data
  const bodyLen = 4 + 4 + mimeBytes.length + 4 + 16 + 4 + coverBytes.length;
  const block = new Uint8Array(4 + bodyLen);

  // Header: not last (0x00) | BlockType 6 (PICTURE) = 0x06
  block[0] = 0x06;
  block[1] = (bodyLen >> 16) & 0xff;
  block[2] = (bodyLen >> 8) & 0xff;
  block[3] = bodyLen & 0xff;

  let offset = 4;
  // Picture Type = 3 (Front Cover, 4 bytes uint32 big endian)
  block[offset++] = 0; block[offset++] = 0; block[offset++] = 0; block[offset++] = 3;

  // Mime len
  block[offset++] = (mimeBytes.length >> 24) & 0xff;
  block[offset++] = (mimeBytes.length >> 16) & 0xff;
  block[offset++] = (mimeBytes.length >> 8) & 0xff;
  block[offset++] = mimeBytes.length & 0xff;
  block.set(mimeBytes, offset);
  offset += mimeBytes.length;

  // Description length = 0
  block[offset++] = 0; block[offset++] = 0; block[offset++] = 0; block[offset++] = 0;

  // Width(0), Height(0), Depth(24), Colors(0)
  block[offset++] = 0; block[offset++] = 0; block[offset++] = 0; block[offset++] = 0;
  block[offset++] = 0; block[offset++] = 0; block[offset++] = 0; block[offset++] = 0;
  block[offset++] = 0; block[offset++] = 0; block[offset++] = 0; block[offset++] = 24;
  block[offset++] = 0; block[offset++] = 0; block[offset++] = 0; block[offset++] = 0;

  // Image data length
  block[offset++] = (coverBytes.length >> 24) & 0xff;
  block[offset++] = (coverBytes.length >> 16) & 0xff;
  block[offset++] = (coverBytes.length >> 8) & 0xff;
  block[offset++] = coverBytes.length & 0xff;
  block.set(coverBytes, offset);

  return block;
}
