const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

export function getLogoDisplayUrl(url: string) {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;

  const markerIndex = url.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
  if (markerIndex === -1) return url;

  const base = url.slice(0, markerIndex + CLOUDINARY_UPLOAD_SEGMENT.length);
  const tail = url.slice(markerIndex + CLOUDINARY_UPLOAD_SEGMENT.length);

  if (!tail || tail.startsWith("e_background_removal/")) return url;

  return `${base}e_background_removal/f_png/${tail}`;
}
