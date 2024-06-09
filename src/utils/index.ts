/**
 * @param {boolean} [strict=true] - When set to `true` (default), the generated regular expression will match the
 *                                  input string exactly, ensuring that the entire string is matched from start to
 *                                  finish. When set to `false`, the generated regular expression will allow partial
 *                                  matches, meaning the input string can appear anywhere within the text being
 *                                  searched. Default `true`.
 */
export const stringToCaseInsensitiveRegex = (
  string: string,
  strict: boolean = true
): RegExp => {
  if (strict) string = `^${string}$`;
  return new RegExp(string, 'i');
};
