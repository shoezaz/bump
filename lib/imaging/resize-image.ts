import Jimp from 'jimp';

export async function resizeImage(
  buffer: Buffer,
  mimeType: string
): Promise<Buffer> {
  const maxSize = 96 * 4;
  const image = await Jimp.read(buffer);
  if (image.getHeight() !== image.getHeight()) {
    throw new Error('Image is not a square');
  }
  const currentSize = Math.max(image.getWidth(), image.getHeight());
  if (currentSize > maxSize) {
    image.resize(Jimp.AUTO, maxSize);
  }

  return image.getBufferAsync(mimeType);
}
