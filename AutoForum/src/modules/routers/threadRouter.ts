import http from "http";
import * as threadController from "../controllers/threadController";

const threadRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string) => {
    switch(pathName){
        case "create":{
            threadController.create(request, response);
            break;
        }
    }
}

export = threadRouter