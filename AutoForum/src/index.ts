import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import { Pool } from "pg";
import renderPage from "./modules/render";
import getContentType from "./modules/contentType";
import sendSQLRequest from "./modules/forDB";
import { parse } from'querystring';
import pageRouter from "./modules/routers/pageRouter";
import authRouter from "./modules/routers/authRouter";
import threadRouter from "./modules/routers/threadRouter";
import messageRouter from "./modules/routers/messageRouter";
import  readFile  from "./modules/readFile";

const server = http.createServer((request, response) => {
  const urlRequest = url.parse(request.url!, true);
  const pathName = urlRequest.pathname?.split("/");
  if (pathName){
    if (pathName[1] == "api"){
      switch (pathName[2]) {
        case "auth":{
          authRouter(request, response, pathName[3]);
          break;
        }
        case "thread":{
          threadRouter(request, response, pathName[3]);
          break;
        }
        case "message":{
          messageRouter(request, response, pathName[3]);
          break;
        }
      
      }
    }
    else{
      pageRouter(request, response, pathName[1]);
    }
  }
 
  const filePath: string = path.join(__dirname, request.url!);
  readFile(request, response, filePath);
});

server.listen(3000, () => console.log("Server running on port 3000"));

