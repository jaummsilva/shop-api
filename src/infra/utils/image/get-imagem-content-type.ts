import path from 'path'

export function getImageContentType(imagePath: string): string {
  const ext = path.extname(imagePath).toLowerCase()
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    default:
      return 'application/octet-stream' // Default to binary if extension is unknown
  }
}
