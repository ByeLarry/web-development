import url from "url";
import type http from "http";
import fs from "fs";
import * as formidable from "formidable";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import testCheck from "../tesAPI";

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
  const form = new formidable.IncomingForm();
  form.parse(request, function (err, fields, files): void {
    if (err) {
      console.log(err);
    }
    const { threadId, message, test } = fields;
    if (threadId[0] === "") {
      response.writeHead(400);
      response.write("Error 400! Thread Id not found!\n");
      response.end();
      return;
    }

    testCheck(response, Number(test[0]));
    if (Number(test[0]) === 1) {
      return;
    }

    let fileDir = null;
    if (files.file !== undefined) {
      const fileToJSON = JSON.stringify(files.file);
      const fileArray = JSON.parse(fileToJSON);
      const currentPath = fileArray[0].filepath;
      fileDir = `${new Date().getTime()}.png`;
      const newFilePath = `src/uploads/${fileDir}`;
      fs.rename(currentPath, newFilePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    console.log("bad");
    sendSQLRequest(
      `insert into messages(content, thread_id, name, image) values ('${message}', ${threadId}, '${username}', '${fileDir}')`
    )
      .then(() => {
        response.writeHead(200);
        response.write(`Message sent on thread ${threadId}.`);
        response.end();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

export { getAll, newMsg };
// get, post
