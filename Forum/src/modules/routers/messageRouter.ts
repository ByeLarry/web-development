import type http from "http";
import * as messageController from "../controllers/messageController";

function messageRouter(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  pathName: string,
  username: string
): void {
  switch (pathName) {
    case "get": {
      messageController.getAll(request, response);
      break;
    }
    case "newMsg": {
      messageController.newMsg(request, response, username);
      break;
    }
  }
}

export = messageRouter;
