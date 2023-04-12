import http from "http";
import url from "url";
import sendSQLRequest from "../forDB";
import getPostData from "../getPostData";

const create = (request: http.IncomingMessage, response: http.ServerResponse) => {
    getPostData(request).then(
        body => {
            const {threadTitle} = JSON.parse(body);
            sendSQLRequest(`INSERT INTO threads (title) VALUES ('${threadTitle}')`)
        }
    )
}

export {create};