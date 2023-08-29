import type http from "http";
import jwt, { type JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

function DecodingUsername(request: http.IncomingMessage): any {
  const allCookie = request.headers.cookie;
  const secret = process.env.SECRET;
  let token;
  if (allCookie !== null && allCookie !== undefined) {
    const cookies = allCookie.split(";");
    for (const c of cookies) {
      const [name, value] = c.split("=");
      if (name.trim() === "token") {
        token = value;
        break;
      }
    }
  }
  let decoded;
  if (token !== undefined && secret !== undefined) {
    decoded = jwt.verify(token, secret) as JwtPayload;
  }
  return decoded?.username;
}

export = DecodingUsername;
