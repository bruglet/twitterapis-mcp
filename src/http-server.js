import { createServer } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const MCP_PATH = "/mcp";
const HEALTH_PATH = "/healthz";

function sendText(response, status, body, headers = {}) {
  response.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    ...headers,
  });
  response.end(body);
}

async function closeMcpResources(transport, server) {
  await transport?.close();
  await server?.close();
}

export function createHttpServer({ accessAuthenticator, mcpServerFactory } = {}) {
  if (typeof accessAuthenticator !== "function") {
    throw new TypeError("accessAuthenticator must be a function");
  }
  if (typeof mcpServerFactory !== "function") {
    throw new TypeError("mcpServerFactory must be a function");
  }

  return createServer((request, response) => {
    void handleHttpRequest(request, response, { accessAuthenticator, mcpServerFactory });
  });
}

async function handleHttpRequest(request, response, { accessAuthenticator, mcpServerFactory }) {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (requestUrl.pathname === HEALTH_PATH) {
    if (request.method !== "GET") {
      sendText(response, 405, "Method not allowed\n", { allow: "GET" });
      return;
    }
    sendText(response, 200, "ok\n");
    return;
  }

  if (requestUrl.pathname !== MCP_PATH) {
    sendText(response, 404, "Not found\n");
    return;
  }

  let authorized = false;
  try {
    authorized = await accessAuthenticator(request);
  } catch {
    authorized = false;
  }
  if (!authorized) {
    sendText(response, 403, "Forbidden\n");
    return;
  }

  let server;
  let transport;
  let resourcesClosed = false;
  const closeResources = async () => {
    if (resourcesClosed) {
      return;
    }
    resourcesClosed = true;
    await closeMcpResources(transport, server);
  };

  response.once("close", () => {
    void closeResources();
  });

  try {
    server = mcpServerFactory();
    transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(request, response);
  } catch (error) {
    if (!response.headersSent) {
      sendText(response, 500, "Internal server error\n");
    }
    console.error(
      "[twitterapis-mcp] MCP request error:",
      error instanceof Error ? error.message : "unknown error",
    );
  } finally {
    await closeResources();
  }
}
