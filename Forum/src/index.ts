import http from "http";
import url from "url";
import * as dotenv from "dotenv";
import pageRouter from "./modules/routers/pageRouter";
import authRouter from "./modules/routers/authRouter";
import threadRouter from "./modules/routers/threadRouter";
import messageRouter from "./modules/routers/messageRouter";
import DecodingUsername from "./modules/decoding";
import userRouter from "./modules/routers/userRouter";

dotenv.config();

const server = http.createServer((request, response) => {
  const urlRequest = url.parse(request.url!, true);
  const pathName = urlRequest.pathname?.split("/");
  const decodedUsername: string = DecodingUsername(request);
  if (pathName != null) {
    if (pathName[1] === "api") {
      switch (pathName[2]) {
        case "auth": {
          authRouter(request, response, pathName[3]);
          break;
        }
        case "thread": {
          threadRouter(request, response, pathName[3]);
          break;
        }
        case "message": {
          messageRouter(request, response, pathName[3], decodedUsername);
          break;
        }
        case "user": {
          userRouter(request, response, pathName[3], decodedUsername);
          break;
        }
      }
    } else {
      pageRouter(request, response, pathName[1], decodedUsername);
    }
  }
});

server.listen(Number(process.env.SERVER_PORT), () => {
  console.log(`Server started on port ${Number(process.env.SERVER_PORT)}`);
});
