// Helper function to convert string aspect ratio to number
export const parseAspectRatio = (aspectRatio: string): number => {
  const parts = aspectRatio.split("/")
  if (parts.length === 2) {
    const width = parseFloat(parts[0])
    const height = parseFloat(parts[1])
    if (!Number.isNaN(width) && !Number.isNaN(height) && height !== 0) {
      return width / height
    }
  }
  return 1 // fallback to square ratio
}
