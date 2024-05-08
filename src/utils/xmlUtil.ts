import { Builder } from "xml2js";

export const xmlBuilder = new Builder({
    xmldec: {
      version: "1.0",
      encoding: "GB2312",
      standalone: true
    }
  });
