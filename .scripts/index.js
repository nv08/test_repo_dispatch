import { FIGMA_API, getHeaders } from "./constants.js";
import { fetchIconsWithoutImage } from "./icons/iconsWithoutImage/index.js";
import { getImages } from "./images/index.js";
import { spawn } from "child_process";

const Function_Callbacks = [fetchIconsWithoutImage, getImages];

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
    //run sh script in spawn
    const child = spawn("sh", ["./images.sh"]);
    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
    child.on("error", (error) => {
      console.error(`error: ${error.message}`);
    });
  }
})();
