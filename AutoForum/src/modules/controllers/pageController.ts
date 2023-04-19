import http from "http";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import { Pool } from "pg";
import url from "url";

const home = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
    sendSQLRequest("SELECT * FROM threads")
      .then(data => {
        renderPage(response, "index.ejs", data, username);
      })
}

const vhod = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
    renderPage(response, "vhod.ejs",{}, username);
}

const reg = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
   renderPage(response, "reg.ejs",{}, username); 
}

const thread = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
  const urlRequest = url.parse(request.url!, true);
  const threadId = urlRequest.query.id;
  sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit 10`)
  .then(messages => {
    sendSQLRequest(`SELECT * FROM threads where id = ${threadId}`)
      .then(thread => {
        renderPage(response, "thread.ejs", {messages, thread}, username);
      })
  });
}

const user = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
  renderPage(response, "user.ejs",{}, username);
}

export {home, vhod, reg, thread, user}