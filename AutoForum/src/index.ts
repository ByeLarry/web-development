import http from "http";
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
import jwt, { JwtPayload } from "jsonwebtoken";
import DecodingUsername from "./modules/decoding";
import userRouter from "./modules/routers/userRouter";
import * as dotenv from "dotenv";
dotenv.config(); 


const server = http.createServer((request, response) => {
  const urlRequest = url.parse(request.url!, true);
  const pathName = urlRequest.pathname?.split("/");

  const decodedUsername: string = DecodingUsername(request);

  if (pathName){
    if (pathName[1] == "api"){
      switch (pathName[2]) {
        case "auth":{
          authRouter(request, response, pathName[3], decodedUsername);
          break;
        }
        case "thread":{
          threadRouter(request, response, pathName[3], decodedUsername);
          break;
        }
        case "message":{
          messageRouter(request, response, pathName[3], decodedUsername);
          break;
        }
        case "user":{
          userRouter(request, response, pathName[3], decodedUsername);
          break;
        }
      
      }
    }
    else{
      pageRouter(request, response, pathName[1], decodedUsername);
    }
  }
 
  const filePath: string = path.join(__dirname, request.url!);
  readFile(request, response, filePath);
});

server.listen(Number(process.env.SERVER_PORT));

