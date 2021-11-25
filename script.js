const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  FetchingJSONSchemaStore,
} = require("./dist/quicktype-core");

async function quicktypeJson(targetLanguage, typeName, jsonString) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: {
      'just-types': true,
      'runtime-typecheck': false,
      'explicit-unions': true,
    }
  });
}

async function getTsTypeFromJson(jsonString, typeName) {
  const { lines } = await quicktypeJson(
    "typescript",
    typeName,
    jsonString,
  );
  return lines.join("\n");
}

window.getTsTypeFromJson = getTsTypeFromJson;
