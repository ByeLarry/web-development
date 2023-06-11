/* eslint-disable @typescript-eslint/no-floating-promises */
import type http from 'http'
import sendSQLRequest from '../forDB'
import getPostData from '../getPostData'
import cookie from 'cookie'

const updatePassword = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  getPostData(request).then(body => {
    const { oldPassword, newPassword } = JSON.parse(body)
    sendSQLRequest(`select exists(select * from users where password = '${oldPassword}' and name = '${username}')`).then(data => {
      if (data[0].exists === true) {
        sendSQLRequest(`update users set password = '${newPassword}' where name = '${username}'`).then(() => {
          response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
          response.end(JSON.stringify({ isUpdate: true }))
        })
      } else {
        response.writeHead(400, { 'Content-Type': 'application/json;charset=utf-8' })
        response.end(JSON.stringify({ isUpdate: false }))
      }
    })
  })
}

const deleteUser = (request: http.IncomingMessage, response: http.ServerResponse, username: string): void => {
  getPostData(request).then(body => {
    const { deleteCookie } = JSON.parse(body)
    sendSQLRequest(`delete from users where name = '${username}'`).then(() => {
      if (deleteCookie === true) {
        response.setHeader('Set-Cookie', cookie.serialize('token', '', {
          httpOnly: true,
          maxAge: -1,
          sameSite: 'strict',
          path: '/'
        }))
        response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
        response.end()
      }
    })
  })
}
export { updatePassword, deleteUser }
