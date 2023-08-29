import type http from "http";
import * as pageController from "../controllers/pageController";

function pageRouter(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  pathName: string,
  username: string
): void {
  switch (pathName) {
    case "": {
      pageController.home(request, response, username);
      break;
    }
    case "thread": {
      pageController.thread(request, response, username);
      break;
    }
    case "theme": {
      pageController.theme(request, response, username);
      break;
    }
  }
}

export = pageRouter;
