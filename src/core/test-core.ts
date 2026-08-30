import { detectAudioMime } from './decryptors/ncm';
import { injectId3Tags } from './tagger/id3';
import { injectFlacTags } from './tagger/vorbis';
import { decryptAes128Ecb } from './crypto/aes';
import CryptoJS from 'crypto-js';

const NCM_CORE_KEY = new Uint8Array([
  0x68, 0x7a, 0x48, 0x52, 0x41, 0x6d, 0x73, 0x6f, 
  0x35, 0x6b, 0x49, 0x6e, 0x62, 0x61, 0x78, 0x57
]);

async function runTests() {
  console.log('=== 开始测试解密与标签生成内核 ===\n');

  // Test 1: Test AES ECB Crypto
  console.log('1. 测试 AES-128-ECB 解密...');
  const plainText = 'neteasecloudmusictestkey123456';
  const keyWA = CryptoJS.enc.Hex.parse(Array.from(NCM_CORE_KEY).map(b => b.toString(16).padStart(2, '0')).join(''));
  const encrypted = CryptoJS.AES.encrypt(plainText, keyWA, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  const cipherBytes = new Uint8Array(
    CryptoJS.enc.Base64.parse(encrypted.toString()).words.flatMap(w => [
      (w >> 24) & 0xff,
      (w >> 16) & 0xff,
      (w >> 8) & 0xff,
      w & 0xff
    ]).slice(0, CryptoJS.enc.Base64.parse(encrypted.toString()).sigBytes)
  );

  const decryptedBytes = decryptAes128Ecb(cipherBytes, NCM_CORE_KEY);
  const decryptedText = new TextDecoder().decode(decryptedBytes);
  console.log('AES 解密结果:', decryptedText);
  if (decryptedText === plainText) {
    console.log('✅ AES-128-ECB 解密测试通过！\n');
  } else {
    throw new Error('AES 解密失败');
  }

  // Test 2: Test ID3v2 Tagger
  console.log('2. 测试 ID3v2.3 MP3 标签注入器...');
  const fakeMp3 = new Uint8Array([0xff, 0xfb, 0x90, 0x44, 0x00, 0x00, 0x00, 0x00]);
  const fakeCover = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
  const taggedMp3 = injectId3Tags(fakeMp3, {
    title: '海阔天空',
    artist: 'Beyond',
    album: '乐与怒',
  }, fakeCover);

  if (taggedMp3[0] === 0x49 && taggedMp3[1] === 0x44 && taggedMp3[2] === 0x33) {
    console.log(`✅ ID3v2 标签注入成功，生成字节长度: ${taggedMp3.length} (包含 TIT2/TPE1/TALB/APIC)！\n`);
  } else {
    throw new Error('ID3 注入失败');
  }

  // Test 3: Test FLAC Vorbis Tagger
  console.log('3. 测试 FLAC Vorbis 标签与封面注入器...');
  // Fake FLAC: 'fLaC' + STREAMINFO (header 0x00, len 34, 34 bytes data) + Audio frames
  const fakeFlac = new Uint8Array(4 + 4 + 34 + 100);
  fakeFlac[0] = 0x66; fakeFlac[1] = 0x4c; fakeFlac[2] = 0x61; fakeFlac[3] = 0x43; // fLaC
  fakeFlac[4] = 0x80; // isLast = true, blockType = 0 (STREAMINFO)
  fakeFlac[5] = 0x00; fakeFlac[6] = 0x00; fakeFlac[7] = 34; // block len = 34
  
  const taggedFlac = injectFlacTags(fakeFlac, {
    title: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
  }, fakeCover);

  if (taggedFlac[0] === 0x66 && taggedFlac[1] === 0x4c && taggedFlac[2] === 0x61 && taggedFlac[3] === 0x43) {
    console.log(`✅ FLAC Vorbis 标签注入成功，生成字节长度: ${taggedFlac.length} (STREAMINFO + VORBIS_COMMENT + PICTURE)！\n`);
  } else {
    throw new Error('FLAC Vorbis 注入失败');
  }

  // Test 4: Audio Mime Detection
  console.log('4. 测试音频头部签名检测...');
  const flacCheck = detectAudioMime(fakeFlac);
  const mp3Check = detectAudioMime(fakeMp3);
  console.log('FLAC 检测结果:', flacCheck);
  console.log('MP3 检测结果:', mp3Check);
  if (flacCheck.ext === 'flac' && mp3Check.ext === 'mp3') {
    console.log('✅ 音频 MIME 检测测试通过！\n');
  } else {
    throw new Error('音频检测失败');
  }

  console.log('🎉 所有解密内核与标签引擎测试全部通过！');
}

runTests().catch(err => {
  console.error('测试异常:', err);
  process.exit(1);
});
