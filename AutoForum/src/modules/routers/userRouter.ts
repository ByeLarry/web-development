import http from "http";
import * as userController from "../controllers/userController";

const userRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string, username: string) => {
    switch(pathName){
        case "create":{
            break;
        }
        case "update":{
            userController.updatePassword(request, response, username);
            break;
        }
        case "delete":{
            userController.deleteUser(request, response, username);
            break;
        }
    }
}

export = userRouter