import { toJpeg, toPng, toSvg } from "html-to-image";
import type { Options as HTMLToImageOptions } from "html-to-image/es/types";

export type CaptureOptions = HTMLToImageOptions & {
  type?: ImageType;
  fileName?: string;
  shouldDownload?: boolean;
};

export type ImageType = "jpeg" | "png";

export function useExport() {
  const erdState = useErd();
  const { unSelectNodes, unSelectEdges } = useVueFlowUtils();

  async function exportAsImage(options: CaptureOptions): Promise<void> {
    const fileType: ImageType = options.type ?? "png";

    logger.info(
      `Exporting diagram as fileType: ${fileType}, quality: ${options.quality}, shouldDownload: ${options.shouldDownload}`,
    );

    const el = getVueflowEl();

    if (!el) {
      logger.error("Cannot export diagram because vueFlowRef is undefined");
      return;
    }

    unSelectNodes();
    unSelectEdges();

    const { imageHeight, imageWidth, transform } =
      getTransformForWholeDiagram();

    let dataUrl: string;
    const fileName = options.fileName ?? `yatoerd-img-${Date.now()}`;

    options = {
      ...options,
      // Remove unwanted element when import
      filter: (node) =>
        !(
          node?.classList?.contains("vue-flow__panel") ||
          node?.classList?.contains("vue-flow__minimap") ||
          node?.classList?.contains("vue-flow__controls")
        ),
      width: imageWidth,
      height: imageHeight,
      style: {
        // Tranform the diagram to the correct position so that the image captures the whole diagram
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
      cacheBust: true,
    };

    logger.info("Export as image options", options);

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

  function exportAsJson(): void {
    erdState.syncStoreWithVueflow();
    const fileType = "json";
    logger.info(`Exporting diagram as fileType: ${fileType}`);

    const jsonState = JSON.stringify(erdState.state, null, 2);
    const blob = new Blob([jsonState], { type: "application/json" });
    const fileName = `yatoerd-${Date.now()}`;
    const url = URL.createObjectURL(blob);

    download(url, fileName, fileType);
  }

  function download(dataUrl: string, fileName: string, fileType: string): void {
    const link = document.createElement("a");
    link.download = `${fileName}.${fileType}`;
    link.href = dataUrl;
    link.click();
  }

  return {
    exportAsJson,
    exportAsImage,
    download,
  };
}
