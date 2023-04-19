import http from "http";
import * as authController from "../controllers/authController";

const authRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string, username: string) => {
    switch (pathName) {
        case "registration":{
            authController.registration(request, response, username);
            break;
        }
        case "login":{
            authController.login(request, response, username);
            break;
        }
        case "logout":{
            authController.logout(request, response, username);
        }
 
    }
}

export = authRouter