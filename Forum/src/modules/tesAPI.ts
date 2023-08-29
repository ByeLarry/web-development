import type http from "http";

function testCheck(response: http.ServerResponse, val: number): void {
  if (val === 1) {
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end("Test successful");
  }
}

export = testCheck;
