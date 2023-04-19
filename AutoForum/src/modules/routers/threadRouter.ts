import http from "http";
import * as threadController from "../controllers/threadController";

const threadRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string, username: string) => {
    switch(pathName){
        case "create":{
            threadController.create(request, response, username);
            break;
        }
    }
}

export = threadRouter