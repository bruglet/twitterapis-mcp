#!/usr/bin/env node
// readme-parity.mjs: the README is the service documentation. A tool that
// exists in the catalog and nowhere in the README is a tool nobody knows to call.
//
// This gate exists because that is exactly what happened. Four tools
// (twitter_users_by_ids, twitter_blocking, twitter_muting, twitter_media_status)
// shipped in 0.6.2 and 0.6.3 without a README row, and the header kept claiming
// "47 tools: 33 reads" while the server advertised 51 and 37. Every other gate
// was green throughout, because none of them read the README.
//
// It compares against the ROUTER (src/tools.js), never against another document.
//
// Run: node test/readme-parity.mjs   (wired into `npm test`)

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { REGISTERED_TOOLS } from "../src/mcp-server.js";
import { TOOLS } from "../src/tools.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const readme = readFileSync(resolve(HERE, "..", "README.md"), "utf8");

const reads = REGISTERED_TOOLS.filter((t) => !t.write);
const writes = REGISTERED_TOOLS.filter((t) => t.write);
const problems = [];

// 1) Every tool has a row. Anchor on the backticked name so a mention inside
//    prose still counts but a bare substring of a longer name does not: without
//    the backticks, "twitter_user_info" would match the row for
//    "twitter_user_info_by_id" and an undocumented tool would score covered.
const undocumented = TOOLS.filter((t) => !readme.includes(`\`${t.name}\``));
for (const t of undocumented) problems.push(`tool ${t.name} appears nowhere in README.md`);

// 2) No stale rows: every twitter_* name the README names must be a real tool.
const known = new Set(TOOLS.map((t) => t.name));
const named = new Set((readme.match(/`(twitter_[a-z0-9_]+)`/g) || []).map((m) => m.slice(1, -1)));
for (const n of named) if (!known.has(n)) problems.push(`README documents "${n}", which is not a tool in the catalog`);

// 3) The stated counts match the catalog. A count is the first thing a reader
//    trusts and the last thing anyone remembers to update.
const claims = [
  {
    re: /(\d+) registered tools: (\d+) reads and (\d+) allowed write actions/,
    where: "the Tools header",
    expected: [REGISTERED_TOOLS.length, reads.length, writes.length],
  },
  {
    re: /Account-only reads and (\d+) allowed write actions usually require a linked X session or per-call credentials/,
    where: "the Tools introduction",
    expected: [writes.length],
  },
  {
    re: /complete upstream catalog contains (\d+) tools/,
    where: "the upstream catalog statement",
    expected: [TOOLS.length],
  },
];
for (const { re, where, expected } of claims) {
  const m = readme.match(re);
  if (!m) {
    problems.push(`could not find the tool-count sentence in ${where}; the gate cannot verify a claim it cannot locate`);
    continue;
  }
  const nums = m.slice(1).map(Number);
  if (JSON.stringify(nums) !== JSON.stringify(expected)) {
    problems.push(`${where} claims ${nums.join("/")} but the catalog is ${expected.join("/")}`);
  }
}

console.log(`  readme-parity: ${REGISTERED_TOOLS.length} registered, ${TOOLS.length} in source, ${named.size} documented`);
if (problems.length) {
  console.error("");
  for (const p of problems) console.error(`  \x1b[31m✗ ${p}\x1b[0m`);
  console.error(`\n  \x1b[31m✗ readme-parity: ${problems.length} drift(s) between the catalog and README.md\x1b[0m`);
  process.exit(1);
}
console.log(`  \x1b[32m✓ readme-parity: every source tool documented, no stale rows, registered counts match\x1b[0m`);
