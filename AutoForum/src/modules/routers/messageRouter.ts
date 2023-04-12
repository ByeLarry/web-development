import http from "http";
import * as messageController from "../controllers/messageController";

const messageRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string) => {
    switch(pathName){
        case "get":{
            messageController.getAll(request, response);
            break;
        }
    }
}

export = messageRouter