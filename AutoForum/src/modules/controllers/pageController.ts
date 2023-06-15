import type http from "http";
import url from "url";
import sendSQLRequest from "../forDB";
import renderPage from "../render";
import sorter from "../sort";

function home(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  sendSQLRequest("select * from themes order by theme_name ASC")
    .then((themeList) => {
      renderPage(response, "index.ejs", { themeList }, username);
    })
    .catch((err) => {
      console.log(err);
    });
}

function vhod(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  renderPage(response, "vhod.ejs", {}, username);
}

function reg(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  renderPage(response, "reg.ejs", {}, username);
}

function thread(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  const urlRequest = url.parse(request.url!, true);
  const threadId = urlRequest.query.id;
  if (threadId != null && threadId !== "") {
    sendSQLRequest(
      `SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit 10`
    )
      .then((messages) => {
        sendSQLRequest(`SELECT * FROM threads where id = ${threadId}`)
          .then((thread) => {
            renderPage(response, "thread.ejs", { messages, thread }, username);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function user(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  renderPage(response, "user.ejs", {}, username);
}

function theme(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  username: string
): void {
  const urlRequest = url.parse(request.url!, true);
  const themeId = urlRequest.query.id;
  const { sort } = urlRequest.query;
  const sortType = sorter(sort);
  if (themeId != null && themeId !== "" && sort != null && sort !== "") {
    sendSQLRequest(
      `SELECT * FROM threads where theme_id='${themeId}' ${sortType} limit 20`
    )
      .then((threadList) => {
        sendSQLRequest(`SELECT * FROM themes where id='${themeId}'`)
          .then((theme) => {
            renderPage(response, "theme.ejs", { threadList, theme }, username);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export { home, vhod, reg, thread, user, theme };
