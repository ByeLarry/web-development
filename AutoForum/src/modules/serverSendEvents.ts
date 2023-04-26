import http from "http";

function sse(request: http.IncomingMessage, response: http.ServerResponse) {
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");

    response.write("data: hello");

}

export = sse