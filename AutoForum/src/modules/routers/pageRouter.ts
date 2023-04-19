import http from "http";
import * as pageController from "../controllers/pageController";

const pageRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string, username: string) => {
    switch (pathName) {
        case "":
        case "home":{
            pageController.home(request, response, username);
            break;
        }
        case "vhod":{
            pageController.vhod(request, response,  username);
            break;
        }
        case "reg":{
            pageController.reg(request, response, username);
            break;
        }
        case "thread":{
            pageController.thread(request, response, username);
            break;
        }    
        case "user":{
            pageController.user(request, response, username);
            break;
        }
    }
}

export = pageRouter