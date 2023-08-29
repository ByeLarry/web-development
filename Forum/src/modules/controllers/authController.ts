import type http from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import sendSQLRequest from "../forDB";
import getPostData from "../getPostData";
import testCheck from "../tesAPI";

function registration(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  getPostData(request)
    .then((body) => {
      const { username, password, test } = JSON.parse(body);
      testCheck(response, Number(test));
      if (Number(test) === 1) {
        return;
      }
      sendSQLRequest(
        `SELECT EXISTS(SELECT id FROM users WHERE name = '${username}')`
      )
        .then((data) => {
          if (data[0].exists === false) {
            sendSQLRequest(
              `insert into users (name, password) values('${username}', '${password}')`
            )
              .then(() => {
                const secret = process.env.SECRET || "secret";
                const token = jwt.sign({ username }, secret, {
                  expiresIn: "1d",
                });
                response.setHeader(
                  "Set-Cookie",
                  cookie.serialize("token", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60,
                    sameSite: "strict",
                    path: "/",
                  })
                );
                response.writeHead(201, {
                  "Content-Type": "application/json;charset=utf-8",
                });
                response.end(JSON.stringify({ isAuthorized: true }));
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            response.writeHead(400, {
              "Content-Type": "application/json;charset=utf-8",
            });
            response.end(JSON.stringify({ isAuthorized: false }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

function login(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  getPostData(request)
    .then((body) => {
      const { username, password, test } = JSON.parse(body);
      testCheck(response, Number(test));
      if (Number(test) === 1) {
        return;
      }
      sendSQLRequest(
        `SELECT EXISTS(SELECT id FROM users WHERE name = '${username}' AND password = '${password}')`
      )
        .then((data) => {
          if (data[0].exists === true) {
            const secret = process.env.SECRET || "secret";
            const token = jwt.sign({ username }, secret, { expiresIn: "1d" });
            response.setHeader(
              "Set-Cookie",
              cookie.serialize("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60,
                sameSite: "strict",
                path: "/",
              })
            );
            response.writeHead(200, {
              "Content-Type": "application/json;charset=utf-8",
            });
            response.end(JSON.stringify({ isAuthorized: true }));
          } else {
            response.writeHead(200, {
              "Content-Type": "application/json;charset=utf-8",
            });
            response.end(JSON.stringify({ isAuthorized: false }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

function logout(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  getPostData(request)
    .then((body) => {
      const { deleteCookie, test } = JSON.parse(body);
      testCheck(response, Number(test));
      if (Number(test) === 1) {
        return;
      }
      if (deleteCookie === true) {
        response.setHeader(
          "Set-Cookie",
          cookie.serialize("token", "", {
            httpOnly: true,
            maxAge: -1,
            sameSite: "strict",
            path: "/",
          })
        );
        response.writeHead(200, {
          "Content-Type": "application/json;charset=utf-8",
        });
        response.end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
export { registration, login, logout };
// post, post, post
