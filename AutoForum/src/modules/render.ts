import type http from "http";
import path from "path";
import ejs from "ejs";

function renderPage(
  response: http.ServerResponse,
  page: string,
  SQLdata?: any,
  username?: any
): void {
  const modData = { SQLdata, username };
  const pagePath: string = path.join(__dirname, "../views/", page);
  ejs.renderFile(pagePath, modData, (err, data) => {
    if (err != null) {
      response.writeHead(404);
      response.write("File not found!\n");
      response.end("Error 404");
      response.end();
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
}

export = renderPage;
