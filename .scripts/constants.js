//temporary
// process.env.FIGMA_API_TOKEN = "figd_5saAjG3cxXYXVJKJjeP-EuHFswy4vb5Jd7I57xeL";

export const FILE_KEY = "7rwTGCVNnMohcCNH08Tvmy";
export const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN;
export const ICONS_WITHOUT_IMAGE_PAGE_NAME = "icons_svg_all";
export const FILE_PATHS = {
  ICONS_WITHOUT_IMAGE: "../images/icons/iconsWithoutImage",
  ICONS_WITHOUT_IMAGE_METADATA: "../metadata",
};
export const FILE_NAMES = {
    ICONS_WITHOUT_IMAGE_METADATA: "iconsWithoutImages.txt",
}

export const NODE_TYPES = {
  FRAME: "FRAME",
  GROUP: "GROUP",
  VECTOR: "VECTOR",
  BOOLEAN_OPERATION: "BOOLEAN_OPERATION",
  STAR: "STAR",
  LINE: "LINE",
  ELLIPSE: "ELLIPSE",
  REGULAR_POLYGON: "REGULAR_POLYGON",
  RECTANGLE: "RECTANGLE",
  TEXT: "TEXT",
  SLICE: "SLICE",
  COMPONENT: "COMPONENT",
  INSTANCE: "INSTANCE",
  COMPONENT_SET: "COMPONENT_SET",
  // add more as needed
};

export const FIGMA_API = {
  getFileData: `https://api.figma.com/v1/files/${FILE_KEY}`,
  getImageByNodeIds: `https://api.figma.com/v1/images/${FILE_KEY}?format=svg`,
};

export const getHeaders = () => {
  const headers = new Headers();
  headers.append("X-FIGMA-TOKEN", FIGMA_API_TOKEN);
  return {
    method: "GET",
    headers,
    redirect: "follow",
  };
};
