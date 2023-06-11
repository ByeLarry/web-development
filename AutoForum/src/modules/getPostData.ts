import type http from 'http'

const getPostData = async (request: http.IncomingMessage): Promise<string> => {
  return await new Promise((resolve, reject) => {
    let body: string = ''
    request.on('data', (chunk: string) => {
      body += chunk.toString()
    })
    request.on('end', () => {
      resolve(body)
    })
  })
}

export = getPostData
