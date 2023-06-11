import type http from 'http'
import * as threadController from '../controllers/threadController'

const threadRouter = (request: http.IncomingMessage, response: http.ServerResponse, pathName: string, username: string): void => {
  switch (pathName) {
    case 'create':{
      threadController.create(request, response, username)
      break
    }
    case 'get':{
      threadController.getAll(request, response, username)
      break
    }
  }
}

export = threadRouter
