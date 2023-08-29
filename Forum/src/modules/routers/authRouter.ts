import type http from "http";
import * as authController from "../controllers/authController";

function authRouter(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  pathName: string
): void {
  switch (pathName) {
    case "registration": {
      authController.registration(request, response);
      break;
    }
    case "login": {
      authController.login(request, response);
      break;
    }
    case "logout": {
      authController.logout(request, response);
    }
  }
}

export = authRouter;
