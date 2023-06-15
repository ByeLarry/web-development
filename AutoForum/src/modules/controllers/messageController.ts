import url from "url";
import type http from "http";
import fs from "fs";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import getPostData from "../getPostData";

function getAll(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  const urlRequest = url.parse(request.url!, true);
  const threadId = urlRequest.query.id;
  const { offset } = urlRequest.query;
  const { limit } = urlRequest.query;
  sendSQLRequest(
    `SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit ${limit} offset ${offset}`
  )
    .then((messages) => {
      renderPage(response, "components/messages.ejs", { messages });
    })
    .catch((err) => {
      console.log(err);
    });
}

function newMsg(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  getPostData(request)
    .then((body) => {
      const { threadId, message, file } = JSON.parse(body);
      let fileDir = null;
      if (file !== null) {
        fileDir = `${new Date().getTime()}.png`;
        const fileParts = file.split(",");
        const fileBody = fileParts[1];
        const binaryData = Buffer.from(fileBody, "base64");
        fs.writeFileSync(`src/uploads/${fileDir}`, binaryData);
      }
      sendSQLRequest(
        `insert into messages(content, thread_id, name, image) values ('${message}', ${threadId}, '${username}', '${fileDir}')`
      )
        .then(() => {
          response.writeHead(200);
          response.end();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

export { getAll, newMsg };
