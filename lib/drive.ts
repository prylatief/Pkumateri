/**
 * Google Drive URL Parser & Helper
 */

/**
 * Extracts Google Drive File ID from various link patterns
 */
export function getGoogleDriveId(url: string): string | null {
  if (!url) return null;

  // Pattern 1: /file/d/FILE_ID/...
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: id=FILE_ID
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Pattern 3: open?id=FILE_ID or uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) {
    return ucMatch[1];
  }

  return null;
}

/**
 * Generates direct download link for Google Drive file
 */
export function getDriveDownloadUrl(url: string): string {
  const fileId = getGoogleDriveId(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Generates preview/embed link for Google Drive file (within an iframe)
 */
export function getDrivePreviewUrl(url: string): string {
  const fileId = getGoogleDriveId(url);
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Generates high-speed unofficial thumbnail link for Google Drive file
 */
export function getDriveThumbnailUrl(url: string): string {
  const fileId = getGoogleDriveId(url);
  if (!fileId) return '/pdf-fallback-thumbnail.png'; // fallback static asset
  return `https://lh3.googleusercontent.com/d/${fileId}=s300`;
}
