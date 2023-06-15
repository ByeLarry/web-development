import type http from "http";
import url from "url";
import sendSQLRequest from "../forDB";
import getPostData from "../getPostData";
import renderPage from "../render";
import sorter from "../sort";

const create = (
  request: http.IncomingMessage,
  response: http.ServerResponse
): void => {
  getPostData(request)
    .then((body) => {
      const { threadTitle, threadId } = JSON.parse(body);
      sendSQLRequest(
        `select exists(select * from threads where title = '${threadTitle}')`
      )
        .then((data) => {
          if (data[0].exists !== true) {
            sendSQLRequest(
              `INSERT INTO threads (title, theme_id) VALUES ('${threadTitle}', '${threadId}')`
            )
              .then(() => {
                response.writeHead(200, {
                  "Content-Type": "application/json;charset=utf-8",
                });
                response.end(JSON.stringify({ isCreatedThread: true }));
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            response.writeHead(400, {
              "Content-Type": "application/json;charset=utf-8",
            });
            response.end(JSON.stringify({ isCreatedThread: false }));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

function getAll(
  request: http.IncomingMessage,
  response: http.ServerResponse
): void {
  const urlRequest = url.parse(request.url!, true);
  const { offset } = urlRequest.query;
  const { limit } = urlRequest.query;
  const themeId = urlRequest.query.id;
  const { sort } = urlRequest.query;
  const sortType = sorter(sort);
  sendSQLRequest(
    `select * from threads where theme_id =${themeId} ${sortType} limit ${limit} offset ${offset}`
  )
    .then((threadList) => {
      renderPage(response, "components/threadList.ejs", { threadList });
    })
    .catch((err) => {
      console.log(err);
    });
}

export { create, getAll };
