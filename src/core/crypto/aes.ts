import CryptoJS from 'crypto-js';

/**
 * AES-128-ECB Decryption using CryptoJS
 */
export function decryptAes128Ecb(ciphertext: Uint8Array, key: Uint8Array): Uint8Array {
  // Convert Uint8Array to CryptoJS WordArray
  const cipherWordArray = uint8ArrayToWordArray(ciphertext);
  const keyWordArray = uint8ArrayToWordArray(key);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: cipherWordArray } as CryptoJS.lib.CipherParams,
    keyWordArray,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return wordArrayToUint8Array(decrypted);
}

function uint8ArrayToWordArray(u8Array: Uint8Array): CryptoJS.lib.WordArray {
  const words: number[] = [];
  const len = u8Array.length;
  for (let i = 0; i < len; i++) {
    words[i >>> 2] |= (u8Array[i] & 0xff) << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, len);
}

function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  const { words, sigBytes } = wordArray;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    u8[i] = byte;
  }
  return u8;
}
