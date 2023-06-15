import type http from "http";
import * as threadController from "../controllers/threadController";

function threadRouter(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  pathName: string
): void {
  switch (pathName) {
    case "create": {
      threadController.create(request, response);
      break;
    }
    case "get": {
      threadController.getAll(request, response);
      break;
    }
  }
}

export = threadRouter;
