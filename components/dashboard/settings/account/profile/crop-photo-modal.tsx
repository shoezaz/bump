import 'react-image-crop/dist/ReactCrop.css';

import * as React from 'react';
import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';
import type { Crop, PercentCrop, PixelCrop } from 'react-image-crop';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { MAX_IMAGE_SIZE } from '@/constants/limits';
import { useEnhancedModal } from '@/hooks/use-enhanced-modal';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
): PercentCrop {
  return centerCrop(
    aspect
      ? makeAspectCrop(
          {
            unit: '%',
            width: 90
          },
          aspect,
          mediaWidth,
          mediaHeight
        )
      : { x: 0, y: 0, width: 90, height: 90, unit: '%' },
    mediaWidth,
    mediaHeight
  );
}

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

async function getCroppedPngImage(
  imageSrc: HTMLImageElement,
  scaleFactor: number,
  pixelCrop: Area
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Context is null, this should never happen.');
  }

  const scaleX = imageSrc.naturalWidth / imageSrc.width;
  const scaleY = imageSrc.naturalHeight / imageSrc.height;

  ctx.imageSmoothingEnabled = false;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    imageSrc,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const croppedImageUrl = canvas.toDataURL('image/png');
  const response = await fetch(croppedImageUrl);
  const blob = await response.blob();

  if (blob.size > MAX_IMAGE_SIZE) {
    return await getCroppedPngImage(imageSrc, scaleFactor * 0.9, pixelCrop);
  }

  return croppedImageUrl;
}

export type CropPhotoModalProps = NiceModalHocProps & {
  file: File;
  aspectRatio?: number;
  circularCrop: boolean;
};

export const CropPhotoModal = NiceModal.create<CropPhotoModalProps>(
  ({ file, aspectRatio, circularCrop }) => {
    const modal = useEnhancedModal();
    const [imgSrc, setImgSrc] = React.useState('');
    const imgRef = React.useRef<HTMLImageElement>(null);
    const [crop, setCrop] = React.useState<Crop>();
    const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
    React.useEffect(() => {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(file);
    }, [file]);
    const title = 'Crop photo';
    const description = 'Adjust the size of the grid to crop your image.';
    const aspect = aspectRatio ? Math.max(0, aspectRatio) : undefined;
    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    };
    const handleApply = async () => {
      if (!completedCrop || !imgRef || !imgRef.current) {
        return;
      }
      const image = await getCroppedPngImage(imgRef.current, 1, {
        x: completedCrop.x,
        y: completedCrop.y,
        width: completedCrop.width,
        height: completedCrop.height
      });

      modal.resolve(image);
      modal.handleClose();
    };
    return (
      <Dialog open={modal.visible}>
        <DialogContent
          className="max-w-lg"
          onClose={modal.handleClose}
          onAnimationEndCapture={modal.handleAnimationEndCapture}
        >
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <Separator />
            <div
              className="flex max-h-full max-w-full items-center justify-center overflow-hidden rounded p-4"
              style={{
                backgroundImage: `linear-gradient(45deg, #b0b0b0 25%, transparent 25%), linear-gradient(-45deg, #b0b0b0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #b0b0b0 75%), linear-gradient(-45deg, transparent 75%, #b0b0b0 75%)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            >
              {Boolean(imgSrc) && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  circularCrop={circularCrop}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    className="!max-h-[277px] max-w-full"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}
            </div>
            <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={modal.handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleApply}
              >
                Apply
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
