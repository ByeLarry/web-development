import http from "http";
import jwt, {JwtPayload} from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const DecodingUsername = (request: http.IncomingMessage) => {
    const allCookie = request.headers.cookie;
    const secret = process.env.SECRET;
    let token;
    if(allCookie){
        const cookies = allCookie.split(";");
        for (const c of cookies){
            const [name, value] = c.split("=");
            if(name.trim() === "token" ){
                token = value;
                break;
            }
        }
    }
    let decoded;
    if (token && secret) {
        decoded = jwt.verify(token, secret) as JwtPayload;
    }
    return decoded?.username;
}

export = DecodingUsername;