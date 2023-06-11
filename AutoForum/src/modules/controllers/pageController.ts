/* eslint-disable @typescript-eslint/no-floating-promises */
import type http from 'http'
import sendSQLRequest from '../forDB'
import renderPage from '../render'
import url from 'url'
import sorter from '../sort'

const home = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  sendSQLRequest('select * from themes order by theme_name ASC').then(themeList => {
    renderPage(response, 'index.ejs', { themeList }, username)
  })
}

const vhod = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  renderPage(response, 'vhod.ejs', {}, username)
}

const reg = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  renderPage(response, 'reg.ejs', {}, username)
}

const thread = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  const urlRequest = url.parse(request.url!, true)
  const threadId = urlRequest.query.id
  if (threadId != null && threadId !== '') {
    sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit 10`)
      .then(messages => {
        sendSQLRequest(`SELECT * FROM threads where id = ${threadId}`)
          .then(thread => {
            renderPage(response, 'thread.ejs', { messages, thread }, username)
          })
      })
  }
}

const user = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  renderPage(response, 'user.ejs', {}, username)
}

const theme = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  const urlRequest = url.parse(request.url!, true)
  const themeId = urlRequest.query.id
  const sort = urlRequest.query.sort
  const sortType = sorter(sort)
  if (themeId != null && themeId !== '' && sort != null && sort !== '') {
    sendSQLRequest(`SELECT * FROM threads where theme_id='${themeId}' ${sortType} limit 20`)
      .then(threadList => {
        sendSQLRequest(`SELECT * FROM themes where id='${themeId}'`).then(theme => {
          renderPage(response, 'theme.ejs', { threadList, theme }, username)
        })
      })
  }
}

export { home, vhod, reg, thread, user, theme }
