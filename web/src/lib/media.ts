export function getLogoDisplayUrl(url: string) {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;

  return url
    .replace("/image/upload/e_background_removal/f_png/", "/image/upload/")
    .replace("/image/upload/f_png/e_background_removal/", "/image/upload/")
    .replace("/image/upload/e_background_removal/", "/image/upload/");
}
