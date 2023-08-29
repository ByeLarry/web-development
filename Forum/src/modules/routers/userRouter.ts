import type http from "http";
import * as userController from "../controllers/userController";

function userRouter(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  pathName: string,
  username: string
): void {
  switch (pathName) {
    case "update": {
      userController.updatePassword(request, response, username);
      break;
    }
    case "delete": {
      userController.deleteUser(request, response, username);
      break;
    }
  }
}

export = userRouter;
