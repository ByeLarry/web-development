import url from "url";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import http from "http";

const getAll = (request: http.IncomingMessage, response: http.ServerResponse) => {
    const urlRequest = url.parse(request.url!, true);
    const threadId = urlRequest.query.id;
      const offset = urlRequest.query.offset;
      const limit = urlRequest.query.limit;
      sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit ${limit} offset ${offset}`)
      .then(messages => {
        renderPage(response, "components/messages.ejs", {messages});  
      })
}

export {getAll};