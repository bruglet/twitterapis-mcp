import { createRequire } from "node:module";
import { buildQuery, resolvePathParams, MissingPathParamError } from "./query.js";

const DEFAULT_BASE_URL = "https://api.twitterapis.com";
const DEFAULT_TIMEOUT_MS = 30000;
const VERSION = createRequire(import.meta.url)("../package.json").version;

const NOT_FOUND_HINTS = [
  [/^\/feedback/, " (not found. No feedback report with that id on this account, and an id from another account will not resolve here. Use the id returned by twitter_feedback_send action=send.)"],
  [/^\/account/, " (not found. That account resource does not exist for this key.)"],
];
const DEFAULT_NOT_FOUND_HINT =
  " (not found. The user, tweet, or list may have been deleted or the id is wrong)";

export function hintFor(status, path) {
  if (status === 401) return " (invalid or missing API key, verify TWITTERAPIS_KEY at https://www.twitterapis.com/dashboard)";
  if (status === 402) return " (insufficient credits, top up at https://www.twitterapis.com/dashboard)";
  if (status === 403) return " (access forbidden. The resource may be private or your plan does not include this endpoint)";
  if (status === 404) {
    for (const [pattern, hint] of NOT_FOUND_HINTS) {
      if (pattern.test(path || "")) return hint;
    }
    return DEFAULT_NOT_FOUND_HINT;
  }
  if (status === 409) return " (no authenticated X session for this key. Write actions and account-only reads (likes, bookmarks, DMs, home timeline, follow, post) require linking an X account/session to your key first; see https://www.twitterapis.com/dashboard)";
  if (status === 429) return " (rate limited. Wait a few seconds and retry; reduce request frequency or increase TWITTERAPIS_TIMEOUT_MS if needed)";
  if (status >= 500) return " (upstream API error. Retry in a moment; if persistent, check https://www.twitterapis.com/status)";
  return "";
}

function getRequestTimeout(rawTimeout) {
  if (!rawTimeout) {
    return DEFAULT_TIMEOUT_MS;
  }

  const parsed = Number(rawTimeout);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  console.error(
    `[twitterapis-mcp] TWITTERAPIS_TIMEOUT_MS="${rawTimeout}" is not a positive number; ` +
      `falling back to the default ${DEFAULT_TIMEOUT_MS}ms instead of timing out every call immediately.`,
  );
  return DEFAULT_TIMEOUT_MS;
}

export function createTwitterApisClient({
  apiKey = process.env.TWITTERAPIS_KEY,
  baseUrl = process.env.TWITTERAPIS_BASE_URL,
  timeoutMs = process.env.TWITTERAPIS_TIMEOUT_MS,
} = {}) {
  const normalizedBaseUrl = (baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const requestTimeoutMs = getRequestTimeout(timeoutMs);

  if (!apiKey) {
    console.error(
      "[twitterapis-mcp] Missing TWITTERAPIS_KEY. Get a key at https://www.twitterapis.com/signup and set it in your MCP client config. Tools are registered but every call will fail until it is set.",
    );
  }

  async function callEndpoint(path, args, method = "GET", jsonBody = false, pathParams = []) {
    if (!apiKey) {
      return {
        isError: true,
        content: [{
          type: "text",
          text: "Missing TWITTERAPIS_KEY (invalid or missing API key, get one at https://www.twitterapis.com/signup and set it in your MCP client config).",
        }],
      };
    }

    let resolvedPath;
    let all;
    try {
      ({ path: resolvedPath, args: all } = resolvePathParams(path, pathParams, args));
    } catch (error) {
      if (error instanceof MissingPathParamError) {
        return { isError: true, content: [{ type: "text", text: error.message }] };
      }
      throw error;
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
      accept: "application/json",
      "user-agent": `twitterapis-mcp/${VERSION}`,
    };

    let url;
    let requestBody;
    if (jsonBody) {
      url = `${normalizedBaseUrl}${resolvedPath}`;
      headers["content-type"] = "application/json";
      requestBody = JSON.stringify(all);
    } else {
      const { auth_token, ct0, user_agent, proxy_url, ...rest } = all;
      const query = buildQuery(rest);
      url = `${normalizedBaseUrl}${resolvedPath}${query ? `?${query}` : ""}`;
      if (auth_token && ct0) {
        headers["x-auth-token"] = auth_token;
        headers["x-ct0"] = ct0;
        if (user_agent) headers["x-user-agent"] = user_agent;
        if (proxy_url) headers["x-proxy-url"] = proxy_url;
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
    try {
      const result = await fetch(url, {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
      });
      const body = await result.text();
      if (!result.ok) {
        const hint = hintFor(result.status, resolvedPath);
        return { isError: true, content: [{ type: "text", text: `HTTP ${result.status}${hint}: ${body.slice(0, 1200)}` }] };
      }
      return { content: [{ type: "text", text: body }] };
    } catch (error) {
      const message = error?.name === "AbortError"
        ? `timed out after ${requestTimeoutMs}ms`
        : error?.message || String(error);
      return { isError: true, content: [{ type: "text", text: `Request failed: ${message}` }] };
    } finally {
      clearTimeout(timer);
    }
  }

  return { callEndpoint, baseUrl: normalizedBaseUrl };
}
