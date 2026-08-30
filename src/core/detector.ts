import { SupportedSourceFormat, DecryptResult } from '../types/music';
import { decryptNcm } from './decryptors/ncm';
import { decryptQmc } from './decryptors/qmc';
import { decryptKgm, isKgmHeader } from './decryptors/kgm';
import { decryptKwm, isKwmHeader } from './decryptors/kwm';

export function detectFormat(file: File, headerBytes: Uint8Array): SupportedSourceFormat {
  const name = file.name.toLowerCase();

  // 1. Check Magic Bytes first
  if (headerBytes.length >= 8) {
    // NCM magic 'CTENFDAM'
    if (
      headerBytes[0] === 0x43 &&
      headerBytes[1] === 0x54 &&
      headerBytes[2] === 0x45 &&
      headerBytes[3] === 0x4e &&
      headerBytes[4] === 0x46 &&
      headerBytes[5] === 0x44 &&
      headerBytes[6] === 0x41 &&
      headerBytes[7] === 0x4d
    ) {
      return 'NCM';
    }

    // KGM / VPR magic
    if (isKgmHeader(headerBytes)) {
      return name.endsWith('.vpr') ? 'VPR' : 'KGM';
    }

    // KWM magic
    if (isKwmHeader(headerBytes)) {
      return 'KWM';
    }
  }

  // 2. Check File Extension
  if (name.endsWith('.ncm')) return 'NCM';
  if (name.endsWith('.qmcflac')) return 'QMCFLAC';
  if (name.endsWith('.qmcogg')) return 'QMCOGG';
  if (name.endsWith('.qmc0')) return 'QMC0';
  if (name.endsWith('.qmc3')) return 'QMC3';
  if (name.endsWith('.qmc')) return 'QMC';
  if (name.endsWith('.mflac')) return 'MFLAC';
  if (name.endsWith('.mgg')) return 'MGG';
  if (name.endsWith('.kgm')) return 'KGM';
  if (name.endsWith('.vpr')) return 'VPR';
  if (name.endsWith('.kwm')) return 'KWM';

  return 'UNKNOWN';
}

export async function decryptMusicFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<DecryptResult> {
  onProgress?.(10);
  const arrayBuffer = await file.arrayBuffer();
  const headerBytes = new Uint8Array(arrayBuffer.slice(0, 16));
  const format = detectFormat(file, headerBytes);

  onProgress?.(30);

  let result: DecryptResult;

  switch (format) {
    case 'NCM':
      result = await decryptNcm(arrayBuffer);
      break;
    case 'QMC':
    case 'QMC0':
    case 'QMC3':
    case 'QMCFLAC':
    case 'QMCOGG':
    case 'MFLAC':
    case 'MGG':
      result = await decryptQmc(arrayBuffer, file.name);
      break;
    case 'KGM':
    case 'VPR':
      result = await decryptKgm(arrayBuffer, file.name);
      break;
    case 'KWM':
      result = await decryptKwm(arrayBuffer, file.name);
      break;
    default:
      // Try NCM if magic matches, otherwise throw friendly error
      if (headerBytes[0] === 0x43 && headerBytes[1] === 0x54) {
        result = await decryptNcm(arrayBuffer);
      } else {
        throw new Error(`暂不支持该文件格式 (${file.name})。支持的格式包括：NCM, QMC, MFLAC, MGG, KGM, VPR, KWM 等`);
      }
  }

  onProgress?.(80);
  return result;
}
