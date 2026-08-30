import { MusicMetadata } from '../../types/music';

export const NAMING_TEMPLATES = [
  { id: '{artist} - {title}', label: '歌手 - 歌名 (默认)', preview: '周杰伦 - 晴天.flac' },
  { id: '{title} - {artist}', label: '歌名 - 歌手', preview: '晴天 - 周杰伦.flac' },
  { id: '{title}', label: '仅歌名', preview: '晴天.flac' },
  { id: '{album} - {artist} - {title}', label: '专辑 - 歌手 - 歌名', preview: '叶惠美 - 周杰伦 - 晴天.flac' },
];

/**
 * Resolves file name and relative subfolder paths based on user settings
 */
export function resolveOrganizedPath(
  metadata: MusicMetadata,
  fallbackOriginalName: string,
  template: string,
  ext: string,
  autoOrganizeFolders: boolean
): {
  fileName: string;
  relativePath: string;
  subFolder?: string;
} {
  const cleanOriginalName = fallbackOriginalName.replace(/\.[^/.]+$/, '');
  const title = sanitizeFileName(metadata.title || cleanOriginalName);
  const artist = sanitizeFileName(metadata.artist || '未知歌手');
  const album = sanitizeFileName(metadata.album || '未知专辑');

  // Replace template tags
  let resultName = template
    .replace(/\{artist\}/gi, artist)
    .replace(/\{title\}/gi, title)
    .replace(/\{album\}/gi, album);

  // Fallback if result name becomes empty
  if (!resultName || !resultName.trim()) {
    resultName = `${artist} - ${title}`;
  }

  const fileName = `${resultName}.${ext}`;

  if (autoOrganizeFolders) {
    const subFolder = `${artist}/${album}`;
    const relativePath = `${subFolder}/${fileName}`;
    return {
      fileName,
      relativePath,
      subFolder,
    };
  }

  return {
    fileName,
    relativePath: fileName,
  };
}

/**
 * Remove illegal filename characters
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}
