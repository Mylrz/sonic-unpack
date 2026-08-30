<div align="center">

<img src="./public/logo.svg" width="100" height="100" alt="SonicUnpack Logo" />

# SonicUnpack (音乐转换站)

**现代跨平台音乐解密与格式转换桌面工具 • 100% 纯本地离线 • 高保真原音还原**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Web-black.svg?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg?style=flat-square)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?style=flat-square)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[English](#english-readme) • [简体中文](#简体中文说明)

</div>

---

<a name="简体中文说明"></a>
## 🇨🇳 简体中文说明

**SonicUnpack** 是一款专为音乐爱好者打造的现代化、高颜值、纯本地离线音乐解密与格式转换工具。完美支持网易云、QQ音乐、酷狗、酷我等平台的专有加密格式，毫秒级还原为无损 FLAC 或高品质 MP3，并自动保留高清封面、歌手标签及 LRC 歌词。

### ✨ 核心特性

- 🔒 **100% 纯本地离线**：所有解密算法均在浏览器/客户端本地毫秒级执行，绝不上传任何音频数据，保护隐私与安全。
- 🎵 **高保真原样还原**：默认直接提取无损 FLAC 或 320k MP3 数据流，不进行二次有损转码，零音质损失。
- 📁 **多层级文件夹深度递归**：直接拖入嵌套多层子文件夹的整个音乐目录，自动遍历识别所有深埋的加密文件。
- 🏷️ **智能元数据与高清封面**：自动提取并写入 ID3v2 / FLAC Vorbis 标签（歌名、歌手、专辑、发行年份）及高清专辑封面，支持独立导出同名 `.lrc` 歌词。
- 🎧 **音质规格检测 & 底部迷你播放器**：自动识别 `Hi-Res 24-bit`、`Lossless 16-bit`、`320K` 规格徽章，内置黑胶动效极简试听播放器，即转即听。
- 📂 **智能分级归档与自定义命名**：支持按 `歌手/专辑/歌名.flac` 自动建立层级文件夹，支持自定义文件名模板，方便直接导入车载 U 盘或 Hi-Fi 播放器。
- 📦 **批量一键 ZIP 打包**：支持将全量转换成功的音频与歌词一键打包下载为 `.zip`，告别频繁点击确认。
- 🌍 **5 国语言支持**：内置简体中文、繁體中文、English、日本語、한국어，即时切换。
- 🎨 **极简灰白桌面质感**：低饱和度、12px 圆角、柔和阴影、浅色/深色模式及 6 款预设强调色。

---

### 📊 支持格式矩阵

| 音乐平台 | 加密格式后缀 | 默认还原输出 | 标签与封面保留 | 歌词导出 (.lrc) |
| :--- | :--- | :--- | :---: | :---: |
| **网易云音乐** | `.ncm` | FLAC (无损) / MP3 | ✅ 完整保留 | ✅ 支持 |
| **QQ 音乐** | `.qmc0`, `.qmc3`, `.qmcflac`, `.qmcogg`, `.mflac`, `.mgg` | FLAC / MP3 / OGG | ✅ 完整保留 | ✅ 支持 |
| **酷狗音乐** | `.kgm`, `.vpr` | FLAC / MP3 | ✅ 完整保留 | ✅ 支持 |
| **酷我音乐** | `.kwm` | FLAC / MP3 | ✅ 完整保留 | ✅ 支持 |

---

### 🚀 快速启动与部署

#### 1. 本地运行
```bash
# 克隆仓库
git clone https://github.com/<your-username>/music-converter-desktop.git
cd music-converter-desktop

# 安装依赖
npm install --legacy-peer-deps

# 启动本地开发服务
npm run dev
```
打开浏览器访问 `http://localhost:5173/` 即可。

#### 2. 一键编译发布
```bash
npm run build
```
编译产物位于 `dist/` 目录，可直接托管在任何静态服务器、GitHub Pages、Vercel 或 Cloudflare Pages。

---

<a name="english-readme"></a>
## 🇺🇸 English README

**SonicUnpack** is a modern, privacy-focused, 100% offline audio decryption and format converter. Effortlessly unlocks proprietary encrypted music files (NCM, QMC, MFLAC, KGM, KWM) into pristine Lossless FLAC or MP3 with tags and artwork intact.

### ✨ Highlights

- 🔒 **100% Offline & Private**: Zero cloud uploads. All decryption runs locally in-memory via pure WebAssembly and TypeScript algorithms.
- 🎵 **Native Lossless Extraction**: Preserves bit-perfect FLAC or 320kbps MP3 without unnecessary re-encoding.
- 📁 **Recursive Nested Folder Drop**: Drag and drop entire music libraries with nested folders.
- 🏷️ **Metadata & Cover Tagging**: Injects ID3v2.3 / FLAC Vorbis comment tags, embedded HD album covers, and companion `.lrc` lyrics.
- 🎧 **Audio Quality Inspector & Mini Player**: Auto-detects `Hi-Res 24-bit`, `Lossless 16-bit`, and `320K` badges with a sleek built-in player.
- 📂 **Auto Organization & Naming Rules**: Organize files into `Artist/Album/Title.ext` hierarchy for car stereos and DAPs.
- 📦 **Bulk One-Click ZIP Download**: Package all converted music and lyrics into a clean `.zip` archive.
- 🌍 **Multilingual**: Supports English, Simplified Chinese, Traditional Chinese, Japanese, and Korean.

---

### ⚖️ 免责声明 (Disclaimer)

1. 本项目仅供个人学习、技术研究以及在合法拥有音频版权前提下的离线备份使用。
2. 请尊重音乐创作者与版权方的合法知识产权，请勿将本工具用于任何商业盈利、非法分发或侵权用途。
3. 使用本工具所产生的一切法律后果由使用者自行承担，与本项目开发者无关。

---

### 📄 开源许可证 (License)

本项目基于 [MIT License](LICENSE) 开源发布。
