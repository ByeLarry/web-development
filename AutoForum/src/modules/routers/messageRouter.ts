import http from "http";
import * as messageController from "../controllers/messageController";
import { user } from "../controllers/pageController";

const messageRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string, username: string) => {
    switch(pathName){
        case "get":{
            messageController.getAll(request, response, username);
            break;
        }
        case "newMsg":{
            messageController.newMsg(request, response, username);
            break;
        }
    }
}

export = messageRouter