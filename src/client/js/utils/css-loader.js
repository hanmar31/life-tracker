const cache = new Map()

/**
 * Loads and caches CSS from a URL.
 *
 * @param {string} url - URL to the CSS file.
 * @returns {Promise<string>} The CSS file content.
 */
export async function loadCSS (url) {
  if (cache.has(url)) return cache.get(url)
  const res = await fetch(url)
  const text = await res.text()
  cache.set(url, text)
  return text
}
