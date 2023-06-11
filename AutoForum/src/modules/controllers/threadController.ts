/* eslint-disable @typescript-eslint/no-floating-promises */
import type http from 'http'
import url from 'url'
import sendSQLRequest from '../forDB'
import getPostData from '../getPostData'
import renderPage from '../render'
import sorter from '../sort'

const create = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  getPostData(request).then(
    body => {
      const { threadTitle, threadId } = JSON.parse(body)
      sendSQLRequest(`select exists(select * from threads where title = '${threadTitle}')`).then(data => {
        if (data[0].exists !== true) {
          sendSQLRequest(`INSERT INTO threads (title, theme_id) VALUES ('${threadTitle}', '${threadId}')`).then(() => {
            response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
            response.end(JSON.stringify({ isCreatedThread: true }))
          })
        } else {
          response.writeHead(400, { 'Content-Type': 'application/json;charset=utf-8' })
          response.end(JSON.stringify({ isCreatedThread: false }))
        }
      })
    }
  )
}

const getAll = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  const urlRequest = url.parse(request.url!, true)
  const offset = urlRequest.query.offset
  const limit = urlRequest.query.limit
  const themeId = urlRequest.query.id
  const sort = urlRequest.query.sort
  const sortType = sorter(sort)
  sendSQLRequest(`select * from threads where theme_id =${themeId} ${sortType} limit ${limit} offset ${offset}`)
    .then(threadList => {
      renderPage(response, 'components/threadList.ejs', { threadList })
    })
}

export { create, getAll }
