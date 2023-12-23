import { join } from "path";
import fs from "fs";

export const modifyToUnderscoreKey = (key) => {
  return key.replace(":", "_");
};

export const modifyToColonKey = (key) => {
  return key.replace("_", ":");
};

export const createFilenameFromNodeId = ({ id, name, extension }) => {
  name = name.replace(/ /g, "_");
  name = name.replace(/\//g, "_");
  const filename = `${name}_${id}.${extension}`;
  return filename;
};

export const downloadAndSaveFile = async ({ url, path, filename }) => {
  // download image file
  const resp = await fetch(url);
  const blob = await resp.blob();
  if (blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const file = Buffer.from(arrayBuffer);
    return writeFileToPath({ path, file, filename });
  }
};

export const writeFileToPath = async ({ path, file, filename }) => {
  try {
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) throw err;
      const filePath = join(path, filename);
      fs.writeFile(filePath, file, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
      });
    });
  } catch (e) {
    console.error(e, "failed to write file");
  }
};
