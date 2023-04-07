import http from "http";
import fs from "fs";
import path from "path";
import url from "url";



const getContentType = (ext: string) => {
  switch (ext) {
    case ".css":
      return "text/css";
    case ".png":
      return "image/png";
    case ".js":
      return "application/javascript";
    default:
      return "text/plain";
  }
}

export = getContentType;