import http from "http";
import * as authController from "../controllers/authController";

const authRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName : string) => {
    switch (pathName) {
        case "registration":{
            authController.registration(request, response);
            break;
        }
        case "login":{
            authController.login(request, response);
            break;
        }
 
    }
}

export = authRouter