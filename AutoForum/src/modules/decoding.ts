import http from "http";
import jwt, {JwtPayload} from "jsonwebtoken";
const DecodingUsername = (request: http.IncomingMessage) => {
    const cookie = request.headers.cookie;
    const secret = "AAABBB";
    const token = cookie?.split("=")[1];
    let decoded;
    if (token && secret) {
        decoded = jwt.verify(token, secret) as JwtPayload;
    }
    return decoded?.username;
}

export = DecodingUsername;