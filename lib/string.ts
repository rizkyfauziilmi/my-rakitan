/**
 * Generate an avatar fallback string from a username (max 2 characters by default).
 *
 * Behavior:
 * - Trims input.
 * - If there are multiple words, returns the first letter of the first word
 *   + the first letter of the last word (e.g. "Ada Lovelace" -> "AL").
 * - If single word, returns the first N grapheme clusters (e.g. "øystein" -> "ØY" if maxChars=2).
 * - Handles Unicode surrogate pairs (emoji, multi-codepoint glyphs) via Array.from.
 * - Skips leading non-letter/digit characters when picking initials.
 */
export function usernameToAvatarFallback(username: string, maxChars = 2): string {
  if (!username) return '';
  const trimmed = username.trim();
  if (!trimmed) return '';

  const graphemes = (s: string) => Array.from(s);

  // Pick the first "meaningful" character of a word (skip leading punctuation)
  const pickFirstMeaningful = (word: string) => {
    const chars = graphemes(word);
    const meaningful = chars.find((ch) => /\p{L}|\p{N}/u.test(ch));
    return meaningful ?? chars[0] ?? '';
  };

  const words = trimmed.split(/\s+/).filter(Boolean);
  let out = '';

  if (words.length >= 2) {
    const first = pickFirstMeaningful(words[0]);
    const last = pickFirstMeaningful(words[words.length - 1]);
    out = (first + last).slice(0, maxChars);
  } else {
    out = graphemes(words[0]).slice(0, maxChars).join('');
  }

  // Uppercase alphabetic characters without mangling emoji/other symbols
  return Array.from(out)
    .map((ch) => (/\p{L}/u.test(ch) ? ch.toLocaleUpperCase() : ch))
    .join('');
}
