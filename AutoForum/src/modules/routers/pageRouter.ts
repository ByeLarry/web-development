import http from "http";
import * as pageController from "../controllers/pageController";

const pageRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string) => {
    switch (pathName) {
        case "":
        case "home":{
            pageController.home(request, response);
            break;
        }
        case "vhod":{
            pageController.vhod(request, response);
            break;
        }
        case "reg":{
            pageController.reg(request, response);
            break;
        }
        case "thread":{
            pageController.thread(request, response);
            break;
        }    
    }
}

export = pageRouter