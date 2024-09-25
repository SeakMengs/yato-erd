import {
  getTransformForBounds,
  getRectOfNodes,
  useVueFlow,
} from "@vue-flow/core";
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
  const { getNodes } = useVueFlow(VUEFLOW_ID);
  const erdState = useErd();
  const { unSelectNodes, unSelectEdges } = useVueFlowUtils();

  // FIXME: the current export as image only act as a screenshot where it export only visible diagram,
  // and it quaility is bad
  async function exportAsImage(options: CaptureOptions): Promise<void> {
    const fileType: ImageType = options.type ?? "png";

    logger.info(
      `Exporting diagram as fileType: ${fileType}, quality: ${options.quality}, shouldDownload: ${options.shouldDownload}`,
    );

    const el = document.querySelector(".vue-flow__viewport") as HTMLElement;

    if (!el) {
      logger.error("Cannot export diagram because vueFlowRef is undefined");
      return;
    }

    unSelectNodes();
    unSelectEdges();

    const nodesBounds = getRectOfNodes(getNodes.value);
    const imageWidth = nodesBounds.width + 400;
    const imageHeight = nodesBounds.height + 400;
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
    );

    let dataUrl: string;
    const fileName = options.fileName ?? `yatoerd-img-${Date.now()}`;

    options = {
      ...options,
      // Remove unwanted element when import
      filter: (node) => !node?.classList?.contains("vue-flow__panel"),
      width: imageWidth,
      height: imageHeight,
      style: {
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    };

    console.log(transform);

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
