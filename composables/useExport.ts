import { useVueFlow } from "@vue-flow/core";
import { toJpeg, toPng } from "html-to-image";
import type { Options as HTMLToImageOptions } from "html-to-image/es/types";
import { VUEFLOW_ID } from "~/constants/key";

export type CaptureOptions = HTMLToImageOptions & {
  type?: ImageType;
  fileName?: string;
  shouldDownload?: boolean;
};

export type ImageType = "jpeg" | "png";

export function useExport() {
  const { vueFlowRef } = useVueFlow(VUEFLOW_ID);

  async function exportAsImage(options: CaptureOptions): Promise<void> {
    const fileType: ImageType = options.type ?? "png";

    logger.info(
      `Exporting diagram as fileType: ${fileType}, quality: ${options.quality}, shouldDownload: ${options.shouldDownload}`,
    );

    if (!vueFlowRef.value) {
      logger.error("Cannot export diagram because vueFlowRef is undefined");
      return;
    }

    let dataUrl: string;
    const fileName = options.fileName ?? `yatoerd-img-${Date.now()}`;
    const el = vueFlowRef.value;

    switch (fileType) {
      case "jpeg":
        dataUrl = await toJpeg(el, options);
        break;
      case "png":
        dataUrl = await toPng(el, options);
        break;
      default:
        dataUrl = await toPng(el, options);
        break;
    }

    // immediately download the image if shouldDownload is true
    if (options.shouldDownload && fileName !== "") {
      logger.info("Export diagram status: downloading the image");
      download(dataUrl, fileName, fileType);
    }
  }

  function download(dataUrl: string, fileName: string, fileType: string): void {
    const link = document.createElement("a");
    link.download = `${fileName}.${fileType}`;
    link.href = dataUrl;
    link.click();
  }

  return {
    exportAsImage,
    download,
  };
}
