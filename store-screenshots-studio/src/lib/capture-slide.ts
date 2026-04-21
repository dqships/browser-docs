import { toPng } from "html-to-image";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/data/design-tokens";

export async function captureSlide(element: HTMLElement) {
  const previousLeft = element.style.left;
  const previousOpacity = element.style.opacity;
  const previousZIndex = element.style.zIndex;

  element.style.left = "0px";
  element.style.opacity = "1";
  element.style.zIndex = "-1";

  const options = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    pixelRatio: 2,
    cacheBust: true,
  };

  await toPng(element, options);
  const dataUrl = await toPng(element, options);

  element.style.left = previousLeft;
  element.style.opacity = previousOpacity;
  element.style.zIndex = previousZIndex;

  return dataUrl;
}
