// HTTP smoke test for the stateless remote MCP.
// Uses a local JWKS server and generated RSA keys. It makes no TwitterAPIs call.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { generateKeyPair, exportJWK, SignJWT } from "jose";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createAccessAuthenticator } from "../src/access-auth.js";
import { createHttpServer } from "../src/http-server.js";
import { createMcpServer, REGISTERED_TOOLS } from "../src/mcp-server.js";
import { TOOLS } from "../src/tools.js";

const packageVersion = createRequire(import.meta.url)("../package.json").version;
const issuer = "https://team.example.com";
const audience = "smoke-audience";
const allowedWriteTools = new Set([
  "twitter_grok_chat",
  "twitter_customer_session",
  "twitter_customer_session_delete",
  "twitter_user_login",
]);

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    if (!server || !server.listening) {
      resolve();
      return;
    }
    server.close((error) => error ? reject(error) : resolve());
  });
}

function initializeBody(id = 1) {
  return {
    jsonrpc: "2.0",
    id,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "http-smoke", version: "1.0.0" },
    },
  };
}

async function makeToken(signingKey, options = {}) {
  const token = new SignJWT({ sub: "smoke-user" })
    .setProtectedHeader({ alg: options.algorithm || "RS256", kid: options.kid || "primary" })
    .setIssuer(options.issuer || issuer)
    .setAudience(options.audience || audience)
    .setIssuedAt();
  if (options.expiration !== undefined) {
    token.setExpirationTime(options.expiration);
  } else if (!options.noExpiration) {
    token.setExpirationTime(Math.floor(Date.now() / 1000) + 300);
  }
  return token.sign(signingKey);
}

const { publicKey, privateKey } = await generateKeyPair("RS256");
const { privateKey: wrongPrivateKey } = await generateKeyPair("RS256");
const { privateKey: wrongAlgorithmPrivateKey } = await generateKeyPair("RS384");
const publicJwk = await exportJWK(publicKey);
publicJwk.kid = "primary";
publicJwk.alg = "RS256";
publicJwk.use = "sig";

let jwksRequests = 0;
const jwksServer = createServer((request, response) => {
  if (request.url !== "/cdn-cgi/access/certs") {
    response.writeHead(404).end();
    return;
  }
  jwksRequests++;
  response.writeHead(200, {
    "content-type": "application/json",
    "cache-control": "public, max-age=300",
  });
  response.end(JSON.stringify({ keys: [publicJwk] }));
});

let mcpServer;
let jwksPort;
try {
  jwksPort = await listen(jwksServer);
  const accessAuthenticator = createAccessAuthenticator({
    teamDomain: issuer,
    audience,
    jwksUri: `http://127.0.0.1:${jwksPort}/cdn-cgi/access/certs`,
  });

  let mcpFactoryCalls = 0;
  let endpointCalls = 0;
  const app = createHttpServer({
    accessAuthenticator,
    mcpServerFactory: () => {
      mcpFactoryCalls++;
      return createMcpServer({
        callEndpoint: async () => {
          endpointCalls++;
          throw new Error("The smoke test must not call TwitterAPIs");
        },
      });
    },
  });
  mcpServer = app;
  const mcpPort = await listen(app);
  const baseUrl = `http://127.0.0.1:${mcpPort}`;
  const validToken = await makeToken(privateKey, { expiration: Math.floor(Date.now() / 1000) + 300 });

  async function postMcp(token, id = 1) {
    const headers = {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
    };
    if (token !== undefined) {
      headers["Cf-Access-Jwt-Assertion"] = token;
    }
    return fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers,
      body: JSON.stringify(initializeBody(id)),
    });
  }

  assert.equal((await fetch(`${baseUrl}/healthz`)).status, 200, "/healthz is public");
  assert.equal(mcpFactoryCalls, 0, "/healthz does not create an MCP server");
  assert.equal((await postMcp()).status, 403, "missing Access JWT is forbidden");
  assert.equal((await postMcp("not-a-jwt")).status, 403, "invalid Access JWT is forbidden");
  assert.equal(
    (await postMcp(await makeToken(privateKey, { issuer: "https://other.example.com" }))).status,
    403,
    "wrong issuer is forbidden",
  );
  assert.equal(
    (await postMcp(await makeToken(privateKey, { audience: "other-audience" }))).status,
    403,
    "wrong audience is forbidden",
  );
  assert.equal(
    (await postMcp(await makeToken(privateKey, { expiration: Math.floor(Date.now() / 1000) - 60 }))).status,
    403,
    "expired JWT is forbidden",
  );
  assert.equal(
    (await postMcp(await makeToken(wrongPrivateKey, { expiration: Math.floor(Date.now() / 1000) + 300 }))).status,
    403,
    "invalid JWT signature is forbidden",
  );
  assert.equal(
    (await postMcp(await makeToken(wrongAlgorithmPrivateKey, { algorithm: "RS384" }))).status,
    403,
    "non-RS256 JWT is forbidden",
  );
  assert.equal(
    (await postMcp(await makeToken(privateKey, { noExpiration: true }))).status,
    403,
    "JWT without expiration is forbidden",
  );

  const directInitialize = await postMcp(validToken, 10);
  assert.equal(directInitialize.status, 200, "valid JWT initializes MCP over HTTP");
  assert.match(await directInitialize.text(), /serverInfo/);

  function makeClient(name) {
    const client = new Client({ name, version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), {
      requestInit: { headers: { "Cf-Access-Jwt-Assertion": validToken } },
    });
    return { client, transport };
  }

  const clients = [makeClient("client-one"), makeClient("client-two")];
  try {
    await Promise.all(clients.map(({ client, transport }) => client.connect(transport)));
    const lists = await Promise.all(clients.map(({ client }) => client.listTools()));
    for (const list of lists) {
      const names = new Set(list.tools.map((tool) => tool.name));
      assert.equal(list.tools.length, 64, "tools/list exposes 64 approved tools");
      assert.deepEqual(
        names,
        new Set(REGISTERED_TOOLS.map((tool) => tool.name)),
        "tools/list matches the registration filter",
      );
      assert.ok(
        TOOLS.filter((tool) => !tool.write).every((tool) => names.has(tool.name)),
        "tools/list exposes all 60 read tools",
      );
      assert.ok(
        [...allowedWriteTools].every((name) => names.has(name)),
        "tools/list exposes the four allowed write tools",
      );
      assert.ok(
        TOOLS.filter((tool) => tool.write && !allowedWriteTools.has(tool.name))
          .every((tool) => !names.has(tool.name)),
        "tools/list hides the other 30 write tools",
      );
      assert.ok(list.tools.every((tool) => tool.name && tool.inputSchema?.type === "object"));
    }
    const hiddenToolResult = await clients[0].client.callTool({
      name: "twitter_create_tweet",
      arguments: { text: "must not send" },
    });
    assert.equal(hiddenToolResult.isError, true, "an unregistered write tool cannot be called");
    assert.match(
      hiddenToolResult.content.map((item) => item.text || "").join(" "),
      /not found|unknown/i,
      "the client receives a missing-tool error",
    );
    assert.equal(endpointCalls, 0, "a rejected write-tool call does not contact TwitterAPIs");
    assert.equal(clients[0].client.getServerVersion().version, packageVersion);
  } finally {
    await Promise.all(clients.map(({ client }) => client.close()));
  }

  assert.equal(jwksRequests, 1, "createRemoteJWKSet caches the signing keys");
  console.log(`smoke: PASS (${REGISTERED_TOOLS.length} tools, two simultaneous clients)`);
} finally {
  await close(mcpServer);
  await close(jwksServer);
}
