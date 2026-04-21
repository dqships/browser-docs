export function resizeDataUrlToBlob(
  dataUrl: string,
  width: number,
  height: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas context unavailable."));
        return;
      }

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";

      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Unable to encode resized PNG."));
          return;
        }

        resolve(blob);
      }, "image/png");
    };

    image.onerror = () => reject(new Error("Unable to decode exported PNG."));
    image.src = dataUrl;
  });
}
