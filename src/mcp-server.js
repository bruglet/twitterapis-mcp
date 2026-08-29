import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOLS } from "./tools.js";

const VERSION = createRequire(import.meta.url)("../package.json").version;
const ALLOWED_WRITE_TOOLS = new Set([
  "twitter_grok_chat",
  "twitter_customer_session",
  "twitter_customer_session_delete",
  "twitter_user_login",
]);

export const REGISTERED_TOOLS = TOOLS.filter(
  (tool) => !tool.write || ALLOWED_WRITE_TOOLS.has(tool.name),
);

export function createMcpServer({ callEndpoint, version = VERSION } = {}) {
  if (typeof callEndpoint !== "function") {
    throw new TypeError("callEndpoint must be a function");
  }

  const server = new McpServer({ name: "twitterapis", version });

  for (const tool of REGISTERED_TOOLS) {
    const method = tool.method || "GET";
    const annotations = {
      title: tool.name,
      readOnlyHint: !tool.write,
      destructiveHint: Boolean(tool.destructive),
      openWorldHint: true,
    };
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: tool.shape, annotations },
      async (args) => callEndpoint(
        tool.path,
        args,
        method,
        Boolean(tool.jsonBody),
        tool.pathParams || [],
      ),
    );
  }

  return server;
}

export { VERSION };
