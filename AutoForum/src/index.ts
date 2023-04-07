import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import { Pool } from "pg";
import renderPage from "./modules/render";
import getContentType from "./modules/contentType";
import sendSQLRequest from "./modules/forDB";
import { parse } from'querystring';

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "forum_db",
  password: "1",
  port: 5432
});

const server = http.createServer((request, response) => {
  const urlRequest = url.parse(request.url!, true);
  switch  (urlRequest.pathname) {
    case "/":
    case "/home":{
      sendSQLRequest("SELECT * FROM threads", pool)
      .then(data => {
        renderPage(response, "index.ejs", data);
      })
      break;
    }
    case "/vhod":{
      renderPage(response, "vhod.ejs");
      break;
    }
    case "/reg":{
      renderPage(response, "reg.ejs");
      break;
    }
    case "/thread":{
      const threadId = urlRequest.query.id;
      sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit 10`, pool)
      .then(messages => {
        sendSQLRequest(`SELECT * FROM threads where id = ${threadId}`, pool)
          .then(thread => {
            renderPage(response, "thread.ejs", {messages, thread});
          })
      })
      break;
    }
    case "/api/messages":{
      const threadId = urlRequest.query.id;
      const offset = urlRequest.query.offset;
      const limit = urlRequest.query.limit;
      sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit ${limit} offset ${offset}`, pool)
      .then(messages => {
        renderPage(response, "components/messages.ejs", {messages});  
      })
      break;
    }
    case "/api/thread/create":{
      let body = ''
        request.on('data', (chunk: any) => {
            body += chunk.toString()
        });
        request.on('end', () => {
          const {title} = parse(body);
          console.log(body);
          sendSQLRequest(`insert into threads(title) values(${title})`, pool)
        })
    }
  }


  const filePath: string = path.join(__dirname, request.url!);
  fs.readFile(filePath, (err, data) => {
    if (!err){
      response.writeHead(200, { "Content-Type": getContentType(path.extname(request.url!)) });
      response.write(data);
      response.end();
    }
  })
});

server.listen(3000, () => console.log("Server running on port 3000"));

