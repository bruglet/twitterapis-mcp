#!/usr/bin/env node
// HTTP entrypoint for the TwitterAPIs remote MCP.

import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { TOOLS } from "./tools.js";
import { createAccessAuthenticator } from "./access-auth.js";
import { createHttpServer } from "./http-server.js";
import { createMcpServer } from "./mcp-server.js";
import { createTwitterApisClient } from "./twitterapis-client.js";

const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_PORT = 3000;

function getPort(rawPort) {
  const port = Number.parseInt(rawPort ?? String(DEFAULT_PORT), 10);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT must be an integer from 0 to 65535; received ${rawPort}`);
  }
  return port;
}

export async function main() {
  const host = process.env.HOST || DEFAULT_HOST;
  const port = getPort(process.env.PORT);
  const twitterapis = createTwitterApisClient();
  const accessAuthenticator = createAccessAuthenticator();
  const server = createHttpServer({
    accessAuthenticator,
    mcpServerFactory: () => createMcpServer({ callEndpoint: twitterapis.callEndpoint }),
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(port, host, resolveListen);
  });

  const address = server.address();
  const boundAddress = typeof address === "object" && address
    ? `${address.address}:${address.port}`
    : `${host}:${port}`;
  console.error(`[twitterapis-mcp] ready · ${TOOLS.length} tools · http://${boundAddress}/mcp`);
  return server;
}

const isMain = process.argv[1]
  && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
  main().catch((error) => {
    console.error("[twitterapis-mcp] fatal:", error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
