import {
  FIGMA_API,
  ICONS_WITHOUT_IMAGE_PAGE_NAME,
  NODE_TYPES,
  getHeaders,
  FILE_PATHS,
  FILE_NAMES,
} from "../../constants.js";
import {
  createFilenameFromNodeId,
  downloadAndSaveFile,
  modifyToUnderscoreKey,
  writeFileToPath,
} from "../../utils.js";

const extractNodes = (node, nodeData) => {
  if (node.type === NODE_TYPES.INSTANCE || node.type === NODE_TYPES.COMPONENT) {
    const nodeId = modifyToUnderscoreKey(node.id);
    nodeData[nodeId] = {
      name: node.name,
      id: nodeId,
      filename: createFilenameFromNodeId({
        id: nodeId,
        name: node.name,
        extension: "svg",
      }),
    };
    return;
  }
  if (node.children) {
    node.children.forEach((child) => extractNodes(child, nodeData));
  }
};

export const fetchIconsWithoutImage = async (fileData) => {
  if (!fileData) return;
  fileData = JSON.parse(fileData);
  let nodeData = {};
  const extract = fileData.document.children.find(
    (child) => child.name === ICONS_WITHOUT_IMAGE_PAGE_NAME
  );
  const iconsData = extract.children;
  iconsData.forEach((icon) => extractNodes(icon, nodeData));
  const imageData = await getImageByNodeIds(nodeData);
  if (imageData) {
    const { images } = imageData;
    // append image url to nodeData
    Object.keys(images).map((key) => {
      const underscoreKey = modifyToUnderscoreKey(key);
      nodeData = {
        ...nodeData,
        [underscoreKey]: {
          ...nodeData[underscoreKey],
          imageUrl: images[key],
        },
      };
    });
  }
  // download and save file
  Object.keys(nodeData).map(async (key) => {
    const node = nodeData[key];
    const regex = /^(ftp|http|https):\/\/[^ "]+\/images\/[^ "]*$/;
    if (node.imageUrl && regex.test(node.imageUrl)) {
      await downloadAndSaveFile({
        url: node.imageUrl,
        path: FILE_PATHS.ICONS_WITHOUT_IMAGE,
        filename: node.filename,
      });
    }
  });
  // write nodedata to a file
  await writeFileToPath({
    path: FILE_PATHS.ICONS_WITHOUT_IMAGE_METADATA,
    file: JSON.stringify(nodeData),
    filename: FILE_NAMES.ICONS_WITHOUT_IMAGE_METADATA,
  });
};

// @api
const getImageByNodeIds = async (nodeData) => {
  let nodeIds = "";
  Object.keys(nodeData).map((key, i) => {
    nodeIds += key.replace("_", ":");
    if (i !== Object.keys(nodeData).length - 1) {
      nodeIds += ",";
    }
  });
  const resp = await fetch(
    `${FIGMA_API.getImageByNodeIds}&ids=${nodeIds}`,
    getHeaders()
  );
  if (resp) {
    const result = await resp.json();
    return result;
  }
};
