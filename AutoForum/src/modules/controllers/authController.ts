import http from "http";
import getPostData from "../getPostData";

const registration = (request: http.IncomingMessage, response: http.ServerResponse) => {
    getPostData(request).then(
        body => {
          const {username, password} = JSON.parse(body);
          console.log(username, password);
          //sendSQLRequest(`insert into users (name, password) values('${username}', '${password}')`, pool)
        }
      )
}

const login = (request: http.IncomingMessage, response: http.ServerResponse) => {
    
}

export  {registration, login};