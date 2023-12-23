import { FIGMA_API, getHeaders } from "./constants.js";
import { fetchIconsWithoutImage } from "./icons/iconsWithoutImage/index.js";

const Function_Callbacks = [fetchIconsWithoutImage];

const getFileData = async () => {
  try {
    const resp = await fetch(FIGMA_API.getFileData, getHeaders());
    if (resp) {
      const result = await resp.text();
      return result;
    }
  } catch (e) {
    console.error(e, "failed to get file data");
  }
};

(async function main() {
  // entry point
  const fileData = await getFileData();
  if (fileData) {
    await Promise.all(Function_Callbacks.map((func) => func(fileData)));
  }
})();
