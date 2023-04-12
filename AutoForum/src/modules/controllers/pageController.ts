import http from "http";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import { Pool } from "pg";
import url from "url";

const home = (request: http.IncomingMessage, response: http.ServerResponse) => {
    sendSQLRequest("SELECT * FROM threads")
      .then(data => {
        renderPage(response, "index.ejs", data);
      })
}

const vhod = (request: http.IncomingMessage, response: http.ServerResponse) => {
    renderPage(response, "vhod.ejs");
}

const reg = (request: http.IncomingMessage, response: http.ServerResponse) => {
   renderPage(response, "reg.ejs"); 
}

const thread = (request: http.IncomingMessage, response: http.ServerResponse) => {
  const urlRequest = url.parse(request.url!, true);
  const threadId = urlRequest.query.id;
  sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit 10`)
  .then(messages => {
    sendSQLRequest(`SELECT * FROM threads where id = ${threadId}`)
      .then(thread => {
        renderPage(response, "thread.ejs", {messages, thread});
      })
  });
}


export {home, vhod, reg, thread}