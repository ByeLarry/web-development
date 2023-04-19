import http from "http";
import url from "url";
import sendSQLRequest from "../forDB";
import getPostData from "../getPostData";
import renderPage from "../render";

const create = (request: http.IncomingMessage, response: http.ServerResponse, username: string) => {
    getPostData(request).then(
        body => {
            const {threadTitle} = JSON.parse(body);
            sendSQLRequest(`INSERT INTO threads (title) VALUES ('${threadTitle}')`)
        }
    )
}

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

export {create, getAll};