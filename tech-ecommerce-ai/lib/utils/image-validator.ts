/**
 * Validates if a URL string is valid for Next.js Image component
 * @param url - The URL to validate
 * @returns true if URL is valid, false otherwise
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  // Check if url exists and is not empty
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }

  const trimmedUrl = url.trim()

  // Check if URL starts with valid protocols or is a relative path
  const isValid =
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('/')

  return isValid
}

/**
 * Filters an array of image URLs to only include valid ones
 * @param urls - Array of URLs to filter
 * @returns Array of valid URLs
 */
export function filterValidImageUrls(urls: (string | null | undefined)[]): string[] {
  return urls.filter((url): url is string => isValidImageUrl(url))
}

/**
 * Gets the first valid image URL from an array, or returns a fallback
 * @param urls - Array of URLs to check
 * @param fallback - Optional fallback URL if no valid URL found
 * @returns First valid URL or fallback
 */
export function getFirstValidImageUrl(
  urls: (string | null | undefined)[],
  fallback?: string
): string | undefined {
  const validUrls = filterValidImageUrls(urls)
  return validUrls[0] || fallback
}
