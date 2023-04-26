import url from "url";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import http from "http";
import getPostData from "../getPostData";

const getAll = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
    const urlRequest = url.parse(request.url!, true);
    const threadId = urlRequest.query.id;
      const offset = urlRequest.query.offset;
      const limit = urlRequest.query.limit;
      sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit ${limit} offset ${offset}`)
      .then(messages => {
        renderPage(response, "components/messages.ejs", {messages} );  
      })
}


const newMsg = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
  getPostData(request).then(
      body => {
        const {threadId, message} = JSON.parse(body);
        sendSQLRequest(`insert into messages(content, thread_id, name) values ('${message}', ${threadId}, '${username}')`)
        .then(() => {
          response.writeHead(200);
          response.end();
        })
      })
}

export {getAll, newMsg};