import http from "http";

const getPostData = (request: http.IncomingMessage) : Promise<string> => {
    return new Promise((resolve, reject) => {
      let body = '';
      request.on('data', (chunk: any) => {
        body += chunk.toString()
      });
      request.on('end', () => {
        resolve(body);
    })
   })
  }

  export = getPostData