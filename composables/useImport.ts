export function useImport() {
  const erdState = useErd();

  function importFromJson(file: File) {
    const fileReader = new FileReader();
    let json;
    fileReader.onload = (event) =>
      (json = JSON.parse(event.target!.result as any));

    // TODO: add error code for fail to import from json
    console.log(json);
  }

  return {
    importFromJson,
  };
}
