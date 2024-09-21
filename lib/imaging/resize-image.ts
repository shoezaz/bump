import { Jimp, JimpMime } from 'jimp';

import type { ObjectValues } from '@/types/object-values';

type JimpMimeType = ObjectValues<typeof JimpMime>;
const maxSize = 96 * 4;

export async function resizeImage(
  buffer: Buffer,
  mimeType: string
): Promise<Buffer> {
  const image = await Jimp.read(buffer);
  if (image.height !== image.width) {
    throw new Error('Image is not a square');
  }
  const currentSize = Math.max(image.width, image.height);
  if (currentSize > maxSize) {
    image.resize({ h: maxSize });
  }

  const m = mimeType.toLowerCase();
  if (Object.values(JimpMime).includes(m as JimpMimeType)) {
    return image.getBuffer(m as JimpMimeType);
  }

  console.warn(`Unsupported mime type, defaulting to ${JimpMime.jpeg}`);

  return image.getBuffer(JimpMime.jpeg);
}
