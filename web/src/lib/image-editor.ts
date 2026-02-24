import type { Area } from "react-easy-crop";

type CropOptions = {
  rotation?: number;
  mimeType?: string;
  quality?: number;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = url;
  });
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = toRadians(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImageDataUrl(imageSrc: string, crop: Area, options?: CropOptions): Promise<string> {
  const image = await createImage(imageSrc);
  const rotation = options?.rotation || 0;
  const mimeType = options?.mimeType || "image/jpeg";
  const quality = options?.quality ?? 0.92;

  const rotatedBounds = rotateSize(image.width, image.height, rotation);

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Canvas is not supported");

  tempCanvas.width = Math.floor(rotatedBounds.width);
  tempCanvas.height = Math.floor(rotatedBounds.height);

  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate(toRadians(rotation));
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

  const outputCanvas = document.createElement("canvas");
  const outputCtx = outputCanvas.getContext("2d");
  if (!outputCtx) throw new Error("Canvas is not supported");

  outputCanvas.width = Math.max(1, Math.floor(crop.width));
  outputCanvas.height = Math.max(1, Math.floor(crop.height));

  outputCtx.drawImage(
    tempCanvas,
    Math.floor(crop.x),
    Math.floor(crop.y),
    outputCanvas.width,
    outputCanvas.height,
    0,
    0,
    outputCanvas.width,
    outputCanvas.height,
  );

  return outputCanvas.toDataURL(mimeType, quality);
}
