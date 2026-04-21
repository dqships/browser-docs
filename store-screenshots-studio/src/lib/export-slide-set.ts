import JSZip from "jszip";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/data/design-tokens";
import { dataUrlToBlob } from "@/lib/data-url-to-blob";
import { downloadBlob } from "@/lib/download-blob";
import { resizeDataUrlToBlob } from "@/lib/resize-data-url-to-blob";
import { sizeSlug } from "@/lib/size-slug";
import { wait } from "@/lib/wait";
import type { SlideSetDefinition, StoreSize } from "@/types/slide-definition";

type ExportSlideSetOptions = {
  getSource: (slug: string) => Promise<string>;
  setDefinition: SlideSetDefinition;
  size: StoreSize;
};

export async function exportSlideSet({
  getSource,
  setDefinition,
  size,
}: ExportSlideSetOptions) {
  const archive = new JSZip();
  const folderName = `${setDefinition.id}-${sizeSlug(size)}`;
  const folder = archive.folder(folderName);

  if (!folder) {
    throw new Error("Unable to create ZIP folder.");
  }

  for (let index = 0; index < setDefinition.slides.length; index += 1) {
    const slide = setDefinition.slides[index];
    const source = await getSource(slide.slug);
    const blob =
      size.width === CANVAS_WIDTH && size.height === CANVAS_HEIGHT
        ? dataUrlToBlob(source)
        : await resizeDataUrlToBlob(source, size.width, size.height);
    const filename = `${String(index + 1).padStart(2, "0")}-${slide.slug}-${size.width}x${size.height}.png`;

    folder.file(filename, blob);
    await wait(300);
  }

  const zipBlob = await archive.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${folderName}.zip`);
}
