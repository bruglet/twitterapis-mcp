import { z } from "zod";
import { PLAYBOOKS } from "./playbooks.js";
import { createRequire } from "node:module";
import { createServer } from "./server.js";
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

export function createMcpServer({ callEndpoint, version = VERSION, ...options } = {}) {
  return createServer({
    ...options,
    version,
    tools: REGISTERED_TOOLS.map((tool) => tool.name === "twitter_grok_chat"
      ? { ...tool, shape: { ...tool.shape, messages: z.union([tool.shape.messages, z.string()]).optional() } }
      : tool),
    playbooks: PLAYBOOKS.filter((playbook) => !["launch-day-monitor", "competitor-follower-outreach"].includes(playbook.name)),
    endpointCaller: callEndpoint,
    instructions: "Live X data is available through this connector. Use read tools for current X posts and profiles. Attachment URLs are not readable by the model; inspect them with twitter_grok_chat only when essential because free-tier Grok is rate-limited. Only session setup, session deletion, login and Grok chat writes are enabled; all other write actions are unavailable.",
  }).server;
}

export { VERSION };
