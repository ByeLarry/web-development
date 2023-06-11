/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable n/no-deprecated-api */
/* eslint-disable @typescript-eslint/no-floating-promises */
import url from 'url'
import sendSQLRequest from '../forDB'
import renderPage from '../render'
import type http from 'http'
import getPostData from '../getPostData'
import fs from 'fs'

function getAll (request: http.IncomingMessage, response: http.ServerResponse, username: string): void {
  const urlRequest = url.parse(request.url!, true)
  const threadId = urlRequest.query.id
  const offset = urlRequest.query.offset
  const limit = urlRequest.query.limit
  sendSQLRequest(`SELECT * FROM messages_view where thread_id = ${threadId} ORDER BY id limit ${limit} offset ${offset}`)
    .then(messages => {
      renderPage(response, 'components/messages.ejs', { messages })
    })
}

const newMsg = function (request: http.IncomingMessage, response: http.ServerResponse, username: string): void {
  getPostData(request).then(
    body => {
      const { threadId, message, file } = JSON.parse(body)
      let fileDir = null
      if (file) {
        fileDir = `${new Date().getTime()}.png`
        const fileParts = file.split(',')
        const fileBody = fileParts[1]
        const binaryData = Buffer.from(fileBody, 'base64')
        fs.writeFileSync(`src/uploads/${fileDir}`, binaryData)
      };
      sendSQLRequest(`insert into messages(content, thread_id, name, image) values ('${message}', ${threadId}, '${username}', '${fileDir}')`).then(() => {
        response.writeHead(200)
        response.end()
      })
    }
  )
}

export { getAll, newMsg }
