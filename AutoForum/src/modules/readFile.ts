import * as fs from "fs";
import path from "path";
import http from "http";
import getContentType from "./contentType";

const readFile = (request: http.IncomingMessage, response: http.ServerResponse, filePath: string) => {
    fs.readFile(filePath, (err, data) => {
      if (!err){
        response.writeHead(200, { "Content-Type": getContentType(path.extname(request.url!)) });
        response.write(data);
        response.end();
      }
    })
  }

export = readFile