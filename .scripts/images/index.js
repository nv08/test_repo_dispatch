import {
  FIGMA_API,
  FIGMA_PAGES,
  FILE_NAMES,
  FILE_PATHS,
  NODE_TYPES,
  getHeaders,
} from "../constants.js";
import {
  createFilenameFromNodeId,
  downloadAndSaveFile,
  modifyToUnderscoreKey,
  writeFileToPath,
} from "../utils.js";

let currentNodeId = ";";
const extractNodes = (node, nodeData) => {
  if (node.type === NODE_TYPES.COMPONENT) {
    currentNodeId = modifyToUnderscoreKey(node.id);
    nodeData[currentNodeId] = {
      name: node.name,
      id: currentNodeId,
      filename: createFilenameFromNodeId({
        id: currentNodeId,
        name: node.name,
        extension: "png",
      }),
    };
  }

  if (node.fills) {
    node.fills.forEach((fill) => {
      if (fill.type === NODE_TYPES.IMAGE) {
        if (nodeData[currentNodeId]) {
          nodeData[currentNodeId].imageRef = fill.imageRef;
        }
      }
    });
  }

  if (node.children) {
    node.children.forEach((child) => extractNodes(child, nodeData));
  }
};

export const getImages = async (fileData) => {
  if (!fileData) return;
  fileData = JSON.parse(fileData);
  let nodeData = {};
  const extract = fileData.document.children.find(
    (child) => child.name === FIGMA_PAGES.IMAGES
  );
  const imagesData = extract.children;
  imagesData.forEach((image) => extractNodes(image, nodeData));
  const imageData = await getImageFills();
  if (imageData) {
    const { images } = imageData.meta;
    // append image url to nodeData
    Object.keys(nodeData).map((key) => {
      nodeData[key].imageUrl = images[nodeData[key].imageRef];
    });
  }
  // download and save file
  Object.keys(nodeData).map(async (key) => {
    const node = nodeData[key];
    const regex = /^(ftp|http|https):\/\/[^ "]+\/img\/[^ "]*$/;
    if (node.imageUrl && regex.test(node.imageUrl)) {
      await downloadAndSaveFile({
        url: node.imageUrl,
        path: FILE_PATHS.IMAGES,
        filename: node.filename,
      });
    }
  });

  // write metadata to file for later use
  writeFileToPath({
    path: FILE_PATHS.IMAGES_METADATA,
    file: JSON.stringify(nodeData),
    filename: FILE_NAMES.IMAGES_METADATA,
  });
};

//@api
const getImageFills = async () => {
  try {
    const resp = await fetch(FIGMA_API.getImageFills, getHeaders());
    if (resp) {
      const result = await resp.json();
      return result;
    }
  } catch (e) {
    console.error(e, "failed to get image fills");
  }
};
