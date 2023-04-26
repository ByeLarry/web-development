import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import ejs from "ejs";



const renderPage = (response: http.ServerResponse, page: string, SQLdata?: any, username?: any) => {
  const modData = { SQLdata, username };
  const pagePath: string = path.join(__dirname,  "../views/", page);
  ejs.renderFile(pagePath, modData, (err, data) => { 
        if (err) {
          console.log(err);
          response.writeHead(404);
          response.write("File not found");
          response.end("error");
          console.log(`Error 404 ${pagePath} not found`);
          response.end();
        } else {
          response.writeHead(200, { "Content-Type": "text/html" });
          response.write(data);
          response.end();
        }   
      }
    )
  }

  export = renderPage;