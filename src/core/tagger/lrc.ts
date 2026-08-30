/**
 * Handles LRC lyric extraction, formatting, and file export
 */
export function extractAndFormatLrc(lyricsJsonOrText: string): string | null {
  if (!lyricsJsonOrText || !lyricsJsonOrText.trim()) {
    return null;
  }

  // Check if it is JSON containing 'lrc' or 'lyric' field (like NCM raw lyrics)
  try {
    const parsed = JSON.parse(lyricsJsonOrText);
    if (parsed.lrc && parsed.lrc.lyric) {
      return parsed.lrc.lyric;
    }
    if (parsed.lyric) {
      return parsed.lyric;
    }
  } catch {
    // Plain text LRC
  }

  // If starts with timestamp e.g. [00:00.00]
  if (lyricsJsonOrText.includes('[') && lyricsJsonOrText.includes(']')) {
    return lyricsJsonOrText;
  }

  return null;
}
