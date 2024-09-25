import { toast } from "~/components/ui/toast";

export function useImport() {
  const erdState = useErd();

  function importFromJson(file: File): void {
    try {
      logger.info(
        `Import diagram state from json file upload by the user. filename: ${file.name}, filetype: ${file.type}, filesize: ${file.size}`,
      );

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (event): void => {
        try {
          const json = JSON.parse(event.target!.result as any);
          erdState.setState(erdState.validateErdState(json));
          toast({
            description: "Erd state has been imported",
          });
        } catch (error) {
          errorHandler(
            new YatoErDError(YatoErDErrorCode.IMPORT_JSON_ERD_STATE),
            "importFromJson",
          );
        }
      };

      reader.onerror = (event): void => {
        logger.error("importFromJson read file error");
      };
    } catch (error) {
      errorHandler(error, "importFromJson");
    }
  }

  return {
    importFromJson,
  };
}
