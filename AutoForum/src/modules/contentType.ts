function getContentType(
  ext: string
): "text/css" | "image/png" | "application/javascript" | "text/plain" {
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
