import assert from "node:assert/strict";
import test from "node:test";
import { createMcpServer, REGISTERED_TOOLS } from "../src/mcp-server.js";

test("fork forwards legacy and typed Grok histories as JSON arrays", async () => {
  const requests = [];
  const server = createMcpServer({ apiKey: "test", fetchImpl: async (_url, init) => {
    requests.push(JSON.parse(init.body));
    return new Response("{}", { status: 200 });
  }});
  try {
    const history = [{ role: "user", content: "test" }];
    const tool = server._registeredTools.twitter_grok_chat;
    for (const messages of [history, JSON.stringify(history)]) {
      assert.equal(tool.inputSchema.safeParse({ messages }).success, true);
      const result = await tool.handler({ messages }, {});
      assert.notEqual(result.isError, true);
    }
    assert.deepEqual(requests.map(request => request.messages), [history, history]);
    const invalid = await tool.handler({ messages: "{}" }, {});
    assert.equal(invalid.isError, true);
    assert.equal(requests.length, 2);
    assert.deepEqual(Object.keys(server._registeredTools), REGISTERED_TOOLS.map(tool => tool.name));
    assert.equal(server._registeredPrompts["launch-day-monitor"], undefined);
    assert.equal(server._registeredPrompts["competitor-follower-outreach"], undefined);
    assert.ok(server._registeredPrompts["account-audit"]);
  } finally { await server.close(); }
});
