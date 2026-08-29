// GENERATED FILE. DO NOT EDIT BY HAND.
//
// Built by scripts/gen-tools.mjs from:
//   test/openapi.snapshot.json    the vendored REST contract (structure)
//   scripts/tools.overrides.mjs   the hand-authored agent-facing layer (prose)
//
// Edit one of those two, then run `npm run build`. `npm test` regenerates this
// file in memory and fails if it does not match what is committed, so a hand edit
// here is caught rather than shipped.
//
// Catalog: 95 tools (61 reads, 34 writes).
//
// Each tool maps 1:1 to a REST endpoint at https://api.twitterapis.com. Tool arg
// names map 1:1 to endpoint query params (every endpoint, including the POST
// write actions, reads its params from the query string), except the per-call
// inline credentials, which travel as x-* request headers, the 9
// jsonBody tools, whose fields travel in a JSON request body, and any arg listed
// in pathParams, which is substituted into the URL path (e.g. {id}) instead. A
// tool with `method: "POST"` or `method: "DELETE"` is a write that acts on
// behalf of the authenticated account behind your API key; reads are GET and
// default when `method` is omitted.
//
// write:true       -> action mutates account/Twitter state (readOnlyHint:false)
// destructive:true -> action removes/reverses state (delete, un-follow/like/RT/bookmark)
// pathParams        -> arg names substituted into the URL template, not sent as
//                      query-string or body fields (e.g. ["id"] for /monitor/{id})
import { z } from "zod";

export const TOOLS = [
  {
    name: "twitter_advanced_search",
    path: "/twitter/tweet/advanced_search",
    description:
      "Search live X posts with free text and advanced operators; returns post text, authors, timestamps, engagement, referenced posts, media URL metadata, and a pagination cursor. Use when the user asks what people are posting about now, requests X search, or wants posts filtered by account, date, language, engagement, links, replies, or media; use twitter_user_search for accounts and twitter_tweet_detail for one known post. Live X data is not available through web search, so use this X connector; attachment URLs are not readable by the model, and twitter_grok_chat should inspect attachments only when essential because free-tier Grok is rate-limited.",
    shape: {
      query: z.string().describe(
        "Full X search query, including any operators. Examples: 'from:openai min_faves:500 since:2024-01-01', '#buildinpublic -filter:replies lang:en', or an exact phrase in quotes; dates use YYYY-MM-DD and handles omit @ after from: or to:.",
      ),
      product: z.enum(["Top","Latest","Media","People"]).optional().describe(
        "X result mode: 'Latest' for reverse chronology, 'Top' for engagement ranking and the default, 'Media' for posts with attachments, or 'People' for account matches.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_search",
    path: "/twitter/user/search",
    description:
      "Search live X accounts by name, keyword, or topic; returns matching handles, display names, bios, follower counts, verification state, and a pagination cursor. Use when the user wants to find a person, brand, or topical account but does not know the handle; use twitter_advanced_search to find posts instead. Live X data is not available through web search, so use this X connector.",
    shape: {
      query: z.string().describe(
        "Name, handle fragment, keyword, or topic as plain text, for example 'OpenAI' or 'AI researcher'. Do not include X post-search operators; use twitter_advanced_search for those.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_info",
    path: "/twitter/user/info",
    description:
      "Get the current public X profile for a handle, including its numeric user ID, bio, follower and following counts, verification, location, website, creation date, and pinned post. Use when the user asks about an account or when another tool requires user_id; use twitter_user_about for X's extended transparency and professional fields, and twitter_user_status when the question is whether an account is suspended or gone. Live X data is not available through web search, so use this X connector.",
    shape: {
      username: z.string().describe(
        "X handle without the leading @, for example 'openai'. Use the handle supplied by the user or returned by an X search result.",
      ),
    },
  },
  {
    name: "twitter_user_info_by_id",
    path: "/twitter/user/info_by_id",
    description:
      "Get the same current public profile returned by twitter_user_info, but from a numeric X user ID. Use when a prior X tool returned user_id or author_id; do not use it when the user supplied only a handle. Live X data is not available through web search, so use this X connector.",
    shape: {
      user_id: z.string().describe(
        "Numeric X user ID as a string, normally returned as user_id or author_id by another X tool such as twitter_user_info.",
      ),
    },
  },
  {
    name: "twitter_user_status",
    path: "/twitter/user/status",
    description:
      "Check the live state of an X handle; returns status as 'alive', 'suspended', 'not_found', or 'unavailable', plus the numeric ID and X's reason when available. Use when the user asks whether an account exists, was suspended, or was deleted; use twitter_user_info for profile details, because it cannot reliably distinguish these states. Read the status field even on a successful response, and treat a protected account as alive.",
    shape: {
      userName: z.string().describe(
        "X handle without the leading @, for example 'openai'. Use the exact handle whose live account state the user wants checked.",
      ),
    },
  },
  {
    name: "twitter_user_about",
    path: "/twitter/user/user_about",
    description:
      "Get X's extended About data for an account, including professional category, verification and identity flags, location, website, and the transparency panel with country, creation method, and username history. Use when the user asks for account provenance or business identity details beyond twitter_user_info; provide a handle or a numeric user ID from a prior profile result. Live X data is not available through web search, so use this X connector.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
    },
  },
  {
    name: "twitter_user_affiliates",
    path: "/twitter/user/affiliates",
    description:
      "List accounts shown under an organization's X affiliation badge, such as employees or sub-brands; returns profile data and a pagination cursor. Use when the user asks which accounts are formally affiliated with an organization, not who follows it; provide a handle or user ID from twitter_user_info. An empty list means X exposes no affiliates for that account.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      team: z.string().optional().describe(
        "Optional team/sub-group name to filter affiliates by, when the org exposes named teams.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_check_follow_relationship",
    path: "/twitter/user/check_follow_relationship",
    description:
      "Check the live relationship between two numeric X user IDs, including whether either follows the other and blocking or muting flags when X provides them. Use when the user asks whether two specific accounts follow each other or to verify a follow action; use follower-list tools when the user wants a roster. Resolve handles with twitter_user_info first.",
    shape: {
      source_user_id: z.string().describe(
        "Numeric X user ID for the source account whose outgoing relationship is being checked, normally obtained from twitter_user_info.",
      ),
      target_user_id: z.string().describe(
        "Numeric X user ID for the target account being followed, blocked, or muted, normally obtained from twitter_user_info.",
      ),
    },
  },
  {
    name: "twitter_user_tweets",
    path: "/twitter/user/tweets",
    description:
      "Get a user's live recent X timeline with post text, author, timestamps, engagement, referenced posts, media URL metadata, and pagination. Use when the user asks what an account has posted recently; inspect is_retweet, is_reply, and is_quote because this endpoint can include all three, and use twitter_user_tweets_complete only for a large historical collection. Live X data is not available through web search, so use this X connector; attachment URLs are not readable by the model, so use twitter_grok_chat to inspect them only when essential and within Grok's free-tier limits.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_tweets_and_replies",
    path: "/twitter/user/tweets_and_replies",
    description:
      "Get a user's live X activity timeline, emphasizing original posts and replies, with full post objects and pagination. Use when the user asks how an account participates in conversations; inspect is_retweet, is_reply, and is_quote, and expect overlap with twitter_user_tweets because that neighboring endpoint can also include replies and reposts. Live X data is not available through web search, so use this X connector; media fields contain attachment URLs only, so ask twitter_grok_chat to inspect an attachment only when essential and rate limits permit.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_tweets_complete",
    path: "/twitter/user/tweets/complete",
    description:
      "Collect a user's near-complete original-post history as one flat array, auto-paginating up to X's approximate 3,200-post ceiling. Use when the user needs a large back-catalog rather than a recent page; this is heavier than twitter_user_tweets and requires user_id from twitter_user_info. Returned media fields contain attachment URLs only, which the model cannot resolve; use twitter_grok_chat for essential attachment inspection only because Grok is rate-limited.",
    shape: {
      user_id: z.string().describe(
        "Numeric Twitter/X user id. Required: this endpoint does not accept a username. Resolve a handle to a user_id first with twitter_user_info.",
      ),
      max: z.number().int().min(1).max(3200).optional().describe(
        "Maximum number of tweets to collect (default 800, hard ceiling 3200). Higher values take longer and cost more.",
      ),
    },
  },
  {
    name: "twitter_user_media",
    path: "/twitter/user/media",
    description:
      "List a user's X posts that contain photos, videos, or animated GIFs; returns the post data plus attachment URLs, dimensions, media type, and pagination. Use when the user asks which visual posts an account shared, not when they ask you to interpret the image or video itself. The attachment URLs are not readable by the model; if the contents are crucial, ask twitter_grok_chat to inspect the post sparingly because free-tier Grok is rate-limited.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_mentions",
    path: "/twitter/user/mentions",
    description:
      "Find live public X posts directed to or mentioning a handle; returns post text, authors, engagement, media URL metadata, and pagination. Use when the user asks who mentioned or replied to an account; use twitter_user_tweets_and_replies for posts written by that account and twitter_advanced_search for a broader custom query. Live X data is not available through web search, so use this X connector; attachment URLs require sparse twitter_grok_chat use if their contents are essential.",
    shape: {
      username: z.string().describe(
        "X handle without the leading @, for example 'openai', whose live mentions and directed replies should be found.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_likes",
    path: "/twitter/user/likes",
    description:
      "List the live X posts a user has liked, most recent first, with authors, engagement, media URL metadata, and pagination. Use when the user asks what an account has endorsed; this is not the authenticated account's private bookmarks, and it requires user_id from twitter_user_info. An empty result can mean the account hides likes; attachment URLs are not model-readable, so reserve twitter_grok_chat for essential inspection.",
    shape: {
      user_id: z.string().describe(
        "Numeric Twitter/X user id (e.g. '44196397'). Required: this endpoint does not accept a username. Resolve a handle to a user_id first with twitter_user_info.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_followers",
    path: "/twitter/user/followers",
    description:
      "List the live X accounts that follow a user, with profile data and pagination. Use when the user asks who follows an account or wants audience analysis; prefer twitter_user_followers_v2 when richer fields or deep cursoring matter, and do not confuse this with accounts the user follows. Live X data is not available through web search, so use this X connector.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_following",
    path: "/twitter/user/following",
    description:
      "List the live X accounts that a user follows, with profile data and pagination. Use when the user asks whom an account follows or wants to map its information network; prefer twitter_user_following_v2 for richer fields or deep cursoring, and use twitter_user_followers for the inverse relationship. Live X data is not available through web search, so use this X connector.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_followers_v2",
    path: "/twitter/user/followers_v2",
    description:
      "List a user's live X followers with the richer v2 profile shape and cursoring suited to large audiences. Use when the user needs fuller follower records or deep pagination; use twitter_user_followers for the simpler neighboring payload and twitter_user_following_v2 for accounts the user follows. Live X data is not available through web search, so use this X connector.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_following_v2",
    path: "/twitter/user/following_v2",
    description:
      "List the live X accounts a user follows with the richer v2 profile shape and cursoring suited to large lists. Use when the user needs fuller following records or deep pagination; use twitter_user_following for the simpler payload and twitter_user_followers_v2 for the inverse relationship. Live X data is not available through web search, so use this X connector.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_user_verified_followers",
    path: "/twitter/user/verified_followers",
    description:
      "List only the verified X accounts that follow a user, with profile data and pagination. Use when the user specifically asks for verified or notable followers; use twitter_user_followers or twitter_user_followers_v2 for the complete follower roster. Verification is not proof of identity or endorsement.",
    shape: {
      username: z.string().optional().describe(
        "X handle without the leading @, for example \"openai\". Provide exactly one of username or user_id; use this form when the user supplied a handle.",
      ),
      user_id: z.string().optional().describe(
        "Numeric X user ID as a string, usually returned by twitter_user_info or another user or post result. Provide exactly one of username or user_id.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_followers_you_know",
    path: "/twitter/user/followers_you_know",
    description:
      "List the followers of a target X account that your authenticated account also follows; returns overlap profiles and pagination. Use when the user asks which shared connections they know, not for all mutual follows or the target's full follower list. Requires a registered X session and target user_id, normally obtained from twitter_user_info.",
    shape: {
      user_id: z.string().describe(
        "Numeric X user ID of the target account, normally returned by twitter_user_info; the authenticated session supplies the other side of the overlap.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_tweet_detail",
    path: "/twitter/tweet/detail",
    description:
      "Read the current contents and metadata of one X post, including text, author, timestamp, engagement counts, reply or quote context, and attachment URL metadata. Use whenever the user provides an X post link or asks what a specific post says; use twitter_tweet_replies for responses and twitter_tweet_thread for the same author's connected sequence. Live X data is not available through web search, so use this X connector; attachment URLs are not readable by the model, and twitter_grok_chat should inspect them only when essential because free-tier Grok is rate-limited.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
    },
  },
  {
    name: "twitter_tweet_replies",
    path: "/twitter/tweet/replies",
    description:
      "Read the live replies under one X post, returning each reply's text, author, engagement, media URL metadata, and pagination. Use when the user asks what people said in response, wants discussion or sentiment, or asks for notable replies; use twitter_tweet_thread for the original author's connected posts instead. Live X data is not available through web search, so use this X connector; attachment URLs require sparse twitter_grok_chat use if their contents are essential.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_tweet_thread",
    path: "/twitter/tweet/thread",
    description:
      "Read the full ordered X thread containing a post: the connected sequence written by the same author, returned in one call with no pagination. Use when the user asks to read or summarize a thread; do not use it for other users' responses, which require twitter_tweet_replies. Live X data is not available through web search, so use this X connector; attachment URLs are not model-readable, and twitter_grok_chat should inspect them only when essential.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
    },
  },
  {
    name: "twitter_tweet_retweeters",
    path: "/twitter/tweet/retweeters",
    description:
      "List the live X accounts that reposted a specific post, with profile data and pagination. Use when the user asks who amplified a post or wants its distribution network; use twitter_tweet_quotes for reposts with added commentary and twitter_tweet_detail for the authoritative repost count. Live X data is not available through web search, so use this X connector.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_tweet_quotes",
    path: "/twitter/tweet/quotes",
    description:
      "List live X posts that quote one post, returning the quoting commentary as full post objects with pagination. Use when the user asks who quoted a post or what quote-posters said; use twitter_tweet_retweeters for plain reposts, twitter_tweet_replies for replies, and twitter_tweet_detail for the authoritative quote_count. This is search-backed, so report returned count only as search matches, inspect quote_matched, discard a non-empty page when quote_matched is 0, and expect index lag plus missing deleted, protected, suspended, or region-withheld posts; attachment URLs are not model-readable and should reach twitter_grok_chat only when essential.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      product: z.enum(["Latest","Top"]).optional().describe(
        "Search ordering. 'Latest' (default) is reverse-chronological and cheap. 'Top' is X's ranked ordering and is materially slower upstream. Any other value falls back to Latest rather than changing what the tool means.",
      ),
      strict: z.string().optional().describe(
        "Pass the string 'true' to drop rows that cannot be proven to quote the target, or 'false' to keep them and inspect quote_matched. The default is false; strict mode can hide genuine quotes when X omits the embedded original, and dropped rows are not billed.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max quote tweets to request for this page. Defaults to 20 and is clamped to 1-100 by the underlying search, so a larger number returns at most 100 rather than erroring.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_list_members",
    path: "/twitter/list/members",
    description:
      "List the current member accounts of a public X List, with profile data and pagination. Use when the user asks who is included in a List or wants its curated account roster; use twitter_list_followers for people who subscribe to the List and a List feed tool for its posts. Obtain list_id from the digits in x.com/i/lists/<list_id>.",
    shape: {
      list_id: z.string().describe(
        "Numeric Twitter/X List id. Found in the list URL: x.com/i/lists/<list_id>.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
    },
  },
  {
    name: "twitter_list_followers",
    path: "/twitter/list/followers",
    description:
      "List the X accounts that subscribe to a public List, with profile data and pagination. Use when the user asks who follows the List; use twitter_list_members for accounts curated into it, because followers and members are different groups. A small follower count is valid even when the List has many members.",
    shape: {
      list_id: z.string().describe(
        "Numeric Twitter/X List id. Found in the list URL: x.com/i/lists/<list_id>.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max items to return for this page. Defaults to 20 and is clamped to 1-100.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call. next_cursor is null once X marks the follower list complete.",
      ),
    },
  },
  {
    name: "twitter_list_tweets",
    path: "/twitter/list/tweets",
    description:
      "Search posts written by members of a public X List, returning full post objects, media URL metadata, and pagination with optional date and reply filters. Use when the user asks for a filterable List feed; use twitter_list_timeline for X's native ordering and reposts, because this search-backed tool omits reposts and can lag behind new posts. Live X data is not available through web search, so use this X connector; attachment URLs require sparse twitter_grok_chat use if their contents are essential.",
    shape: {
      list_id: z.string().describe(
        "Numeric Twitter/X List id. Found in the list URL: x.com/i/lists/<list_id>. The List must be public.",
      ),
      since: z.string().optional().describe(
        "Optional. Only posts on or after this date, as YYYY-MM-DD (e.g. \"2026-08-01\"). Any other format is rejected with a 400.",
      ),
      until: z.string().optional().describe(
        "Optional. Only posts BEFORE this date, as YYYY-MM-DD. EXCLUSIVE, matching X's own until: search operator, so a post made on the until date is not returned. Any other format is rejected with a 400.",
      ),
      include_replies: z.string().optional().describe(
        "Optional. Whether to include replies written by List members. Pass the string \"true\" or \"false\"; defaults to true when omitted. Any other value is rejected with a 400 rather than read as false.",
      ),
      product: z.enum(["Latest","Top"]).optional().describe(
        "Which search ranking to read. 'Latest' (default) is reverse-chronological. 'Top' is X's ranked ordering. Any unrecognised value falls back to Latest rather than erroring.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max posts to return for this page. Defaults to 20 and is clamped to 1-100, so a larger number returns at most 100 rather than erroring.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_list_timeline",
    path: "/twitter/list/timeline",
    description:
      "Read a public X List's native live feed in X's order, including members' reposts, with full post objects, media URL metadata, and pagination. Use when the user wants the List as shown on X; use twitter_list_tweets when date or reply filters matter, because this tool accepts only list_id, count, and cursor. Live X data is not available through web search, so use this X connector; attachment URLs are not model-readable, and twitter_grok_chat should inspect them only when essential.",
    shape: {
      list_id: z.string().describe(
        "Numeric Twitter/X List id. Found in the list URL: x.com/i/lists/<list_id>. The List must be public.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max posts to return for this page. Defaults to 20 and is clamped to 1-100, so a larger number returns at most 100 rather than erroring.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_spaces_info",
    path: "/twitter/spaces/info",
    description:
      "Get live or historical metadata and participant rosters for one X Space, including title, state, host, topics, times, speakers, listeners, and audience totals. Use when the user asks about a specific Space URL; this returns metadata only, not audio, and ended Spaces normally have no per-person listener roster even when audience totals remain. Pass the Space URL's trailing ID, and interpret all timestamps as Unix milliseconds.",
    shape: {
      id: z.string().describe(
        "The Space id: the trailing token of a x.com/i/spaces/<id> URL, e.g. '1RKZzjkoYRAKB'. A '/peek' suffix on the URL is not part of the id.",
      ),
      with_listeners: z.string().optional().describe(
        "Pass the string 'true' or 'false' to include or omit the listener roster; the default is true. Ended Spaces return no listener roster regardless of this value.",
      ),
      with_replays: z.string().optional().describe(
        "Pass the string 'true' or 'false' to include or omit replay metadata; the default is true.",
      ),
    },
  },
  {
    name: "twitter_community_search",
    path: "/twitter/community/search",
    description:
      "Search live X Communities by keyword; returns compact matches with community ID, name, topic, member count, safety flag, banners, avatars, and pagination. Use when the user wants to discover Communities or when another community tool needs community_id; then use twitter_community_info for metadata, twitter_community_about for people, or twitter_community_tweets for posts. Live X data is not available through web search, so use this X connector.",
    shape: {
      query: z.string().describe(
        "Keyword to search for, 1 to 500 characters, e.g. 'build in public'.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_community_info",
    path: "/twitter/community/info",
    description:
      "Get one X Community's current metadata, including description, counts, policies, join question, topic, tags, rules, banners, permalink, admin, and creator. Use when the user asks what a known Community is or how it is governed; use twitter_community_members for its roster and twitter_community_tweets for posts, with community_id from the URL or twitter_community_search. Treat role, can_join, is_pinned, viewer_relationship_type, and rule descriptions as intentionally null on this pooled read.",
    shape: {
      community_id: z.string().describe(
        "Numeric X community id, the digits in a x.com/i/communities/<id> URL, e.g. '1493446837214187523'. Digits only. This is NOT a Space id (those are base-62 tokens) and NOT a user id.",
      ),
    },
  },
  {
    name: "twitter_community_about",
    path: "/twitter/community/about",
    description:
      "Get an X Community's About-tab people data: moderators and a member preview as full profiles with bios, counts, location, website, banner, and join date. Use when the user asks who runs or represents a Community and needs richer profiles; use twitter_community_info for rules and policies, or the member and moderator tools for complete paginated rosters. Provide community_id from the Community URL or twitter_community_search.",
    shape: {
      community_id: z.string().describe(
        "Numeric X community id, the digits in a x.com/i/communities/<id> URL, e.g. '1493446837214187523'.",
      ),
    },
  },
  {
    name: "twitter_community_members",
    path: "/twitter/community/members",
    description:
      "List an X Community's members as paginated { user, role } rows, where role is Admin, Moderator, or Member and the user profile is reduced. Use when the user asks for the full roster; use twitter_community_moderators for a complete leadership list rather than filtering one member page, and twitter_user_info when a member needs a full profile. Stop when members is empty or has_more is false because X provides no total count.",
    shape: {
      community_id: z.string().describe(
        "Numeric X community id, the digits in a x.com/i/communities/<id> URL, e.g. '1493446837214187523'.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max roster rows to return for this page. Defaults to 20 and is clamped to 1-100, so a larger number returns 100 rather than erroring.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call. Absence of next_cursor is the only end-of-list signal X gives on this operation.",
      ),
    },
  },
  {
    name: "twitter_community_moderators",
    path: "/twitter/community/moderators",
    description:
      "List an X Community's moderators and admins as paginated { user, role } rows. Use when the user asks who moderates or administers a Community; do not infer this from one page of twitter_community_members, and read each role because admins also appear here. X provides a cursor but no total count.",
    shape: {
      community_id: z.string().describe(
        "Numeric X community id, the digits in a x.com/i/communities/<id> URL, e.g. '1493446837214187523'.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max rows to return for this page. Defaults to 20 and is clamped to 1-100.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_community_tweets",
    path: "/twitter/community/tweets",
    description:
      "Read an X Community's live post timeline as full post objects, media URL metadata, pagination, and a separate pinned post. Use when the user asks what a Community is posting; read pinned first and then tweets because X does not duplicate it, and use twitter_advanced_search for an all-X query. Live X data is not available through web search, so use this X connector; attachment URLs are not model-readable, and twitter_grok_chat should inspect them only when essential.",
    shape: {
      community_id: z.string().describe(
        "Numeric X community id, the digits in a x.com/i/communities/<id> URL, e.g. '1493446837214187523'.",
      ),
      ranking_mode: z.enum(["Recency","Relevance"]).optional().describe(
        "Ordering, sent to X as a real request parameter. 'Recency' is the default and the only value confirmed against a live capture. 'Relevance' is accepted because X's own community tab offers exactly two orderings, but it is NOT confirmed live, so do not depend on it. Any other value is rejected with a 400.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max posts to return for this page. Defaults to 20 and is clamped to 1-100.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_community_memberships",
    path: "/twitter/community/memberships",
    description:
      "List the X Communities that one numeric user ID belongs to, returning full community objects with pagination. Use when the user asks which communities an account participates in; resolve a handle with twitter_user_info first, and use other community tools when starting from a community instead. An empty list is valid, and caller-relative fields such as role, can_join, is_pinned, and viewer_relationship_type are intentionally null on this pooled read.",
    shape: {
      user_id: z.string().describe(
        "Numeric X user id, e.g. '1281109705495130113'. NOT a @handle and NOT a community id. Resolve a handle to its id with twitter_user_info first.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max communities to return for this page. Defaults to 20 and is clamped to 1-100.",
      ),
      cursor: z.string().optional().describe(
        "Opaque pagination cursor from a previous response's next_cursor field. Omit on the first call.",
      ),
    },
  },
  {
    name: "twitter_grok_chat",
    path: "/twitter/grok/chat",
    method: "POST",
    write: true,
    description:
      "Ask Grok through the authenticated X account; returns one buffered answer with citations, searches, conversation ID, and the model that actually answered. Use when the user explicitly asks for Grok, needs Grok's live-X synthesis, or must inspect an X post's image or video that other tools expose only as an unreadable attachment URL; use direct X tools for ordinary post text, profiles, search, replies, and threads. This call is stateless and subject to the X account's free-tier and rate limits, so use attachment inspection sparingly and pass prior turns plus conversation_id to continue.",
    shape: {
      message: z.string().optional().describe(
        "Single-turn prompt text. Provide either message or messages; for post or attachment inspection, include the full https://x.com/<handle>/status/<id> URL and state exactly what Grok should inspect.",
      ),
      messages: z.string().optional().describe(
        "JSON-encoded array string containing prior turns oldest first, for example [{\"role\":\"user\",\"content\":\"...\"},{\"role\":\"assistant\",\"content\":\"...\"}]. Include every turn Grok needs because the endpoint stores no history; provide either messages or message.",
      ),
      conversation_id: z.string().optional().describe(
        "Conversation id returned by a previous call. Omit on the first turn and one is created for you.",
      ),
      mode: z.string().optional().describe(
        "Which Grok to use: 'auto' (default, balanced), 'fast' (quicker, less thorough) or 'expert' (slowest, most thorough). The response reports the model that actually answered, which can differ from the mode requested.",
      ),
      image_count: z.number().int().optional().describe(
        "How many images Grok may generate if the prompt calls for one. Defaults to the value X's own client sends. Set 0 for a text-only answer.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_grok_config",
    path: "/twitter/grok/config",
    description:
      "Check the authenticated X account's Grok eligibility, free-access state, available models, and X-provided ineligibility reasons. Use before twitter_grok_chat when the user asks which Grok modes are available or when chat access fails; check the same X session that will make the chat call. This reports eligibility only and does not send a prompt.",
    shape: {
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_trends",
    path: "/twitter/trends",
    description:
      "Get X's current ranked trends for Worldwide, a country, or a WOEID location, with resolved location and timestamps. Use when the user asks what is trending on X now; use twitter_trends_locations first for a supported city or region, and prefer woeid when both location fields are available. Live X data is not available through web search, so use this X connector; unsupported locations return an error.",
    shape: {
      country: z.string().optional().describe(
        "Country name or ISO code to get trends for, e.g. 'US' or 'Japan'. Resolved against the trends locations list. Omit for Worldwide.",
      ),
      woeid: z.string().optional().describe(
        "Numeric WOEID from twitter_trends_locations. Takes precedence over country when both are supplied.",
      ),
      count: z.number().int().min(1).optional().describe(
        "Truncate the returned trends list to at most this many. Omit to return X's full list for the location.",
      ),
    },
  },
  {
    name: "twitter_trends_locations",
    path: "/twitter/trends/locations",
    description:
      "List the locations for which X publishes trends, including each numeric WOEID. Use when the user asks for trends in a city or region and you need a supported woeid for twitter_trends; do not use this as the trends result itself.",
    shape: {},
  },
  {
    name: "twitter_account_me",
    path: "/account/me",
    description:
      "Get the current twitterapis.com account's name, email, credit balance and usage, request count, and creation date. Use when the user asks about API account identity, remaining credits, or usage; do not use it for an X profile. This account read is free.",
    shape: {},
  },
  {
    name: "twitter_account_payments",
    path: "/account/payments",
    description:
      "Get the current twitterapis.com account's top-up and charge history. Use when the user asks about API payments or billing transactions; use twitter_account_me for the current credit balance, and do not use this for X account purchases. This account read is free.",
    shape: {},
  },
  {
    name: "twitter_home_timeline",
    path: "/twitter/user/home_timeline",
    description:
      "Read the authenticated X account's live Home timeline, returning full posts, authors, engagement, media URL metadata, and pagination. Use when the user asks what their account currently sees in Following or For You; use public user or search tools for another account's posts. Requires a registered session, and attachment URLs are not model-readable unless twitter_grok_chat inspects them sparingly.",
    shape: {
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_bookmarks",
    path: "/twitter/user/bookmarks",
    description:
      "List the authenticated X account's private bookmarks, most recent first, with full post objects, media URL metadata, and pagination. Use when the user asks to review all saved posts; use twitter_bookmark_search for keywords or twitter_bookmark_folder_timeline for one folder. Requires a registered session, and attachment URLs need sparse twitter_grok_chat use if their contents are essential.",
    shape: {
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_blocking",
    path: "/twitter/user/blocking",
    description:
      "List the accounts blocked by the authenticated X account as full user objects with pagination. Use when the user asks whom their account has blocked; use twitter_muting for hidden-but-not-blocked accounts, and do not attempt to read another account's private block list. Requires a registered session, and an empty users array is a valid result.",
    shape: {
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_muting",
    path: "/twitter/user/muting",
    description:
      "List the accounts muted by the authenticated X account as full user objects with pagination. Use when the user asks whom their account has muted; use twitter_blocking for blocked accounts, because muting and blocking are separate states, and do not attempt to read another account's private mute list. Requires a registered session, and an empty users array is valid.",
    shape: {
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_bookmark_search",
    path: "/twitter/user/bookmark_search",
    description:
      "Search text within the authenticated X account's private bookmarks; returns matching full posts, media URL metadata, and pagination. Use when the user wants to find a saved post by words or topic; use twitter_bookmarks to browse everything and twitter_bookmark_folder_timeline for a known folder. Requires a registered session, and attachment URLs need twitter_grok_chat only when their contents are essential.",
    shape: {
      query: z.string().describe(
        "Search terms to match against your bookmarked tweets' text.",
      ),
      count: z.number().int().min(1).max(200).optional().describe(
        "Maximum items to request for this page, from 1 to 200. Omit it to use the endpoint default of 20; use cursor, not a page number, for later pages.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_bookmark_folders",
    path: "/twitter/user/bookmark_folders",
    description:
      "List the authenticated X account's bookmark folders, returning each folder's ID, name, and cover image URL. Use when the user asks how saved posts are organized or when twitter_bookmark_folder_timeline needs folder_id; use twitter_bookmarks for the flat all-bookmarks feed. Requires a registered session, and cover image URLs are metadata rather than model-readable image contents.",
    shape: {
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_bookmark_folder_timeline",
    path: "/twitter/user/bookmark_folder_timeline",
    description:
      "Read the posts inside one bookmark folder of the authenticated X account, returning full post objects, media URL metadata, and cursor pagination. Use when the user names a folder or asks for its contents; obtain folder_id from twitter_bookmark_folders, and use twitter_bookmarks for the flat saved-post feed. There is no page-size parameter, and attachment URLs require sparse twitter_grok_chat use if essential.",
    shape: {
      folder_id: z.string().describe(
        "The bookmark folder's id, from twitter_bookmark_folders (e.g. '2073826456430592429').",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_dm_list",
    path: "/twitter/dm/list",
    description:
      "List the authenticated X account's Direct Message conversations, returning participant information and conversation_id values. Use when the user asks to inspect their inbox or when twitter_dm_conversation needs an ID; do not use this to send a message. Requires a registered session.",
    shape: {
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_dm_conversation",
    path: "/twitter/dm/conversation",
    description:
      "Read one Direct Message conversation, returning each message's sender ID, timestamp, and text. Use when the user asks to inspect a specific DM thread; obtain conversation_id from twitter_dm_list, and use twitter_dm_send only when the user explicitly asks to send a new message. Requires a registered session.",
    shape: {
      conversation_id: z.string().describe(
        "The conversation_id from a twitter_dm_list entry identifying which DM thread to read.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_dm_send",
    path: "/twitter/dm/send",
    method: "POST",
    write: true,
    description:
      "Send a real Direct Message from the authenticated X account and return message_id plus conversation_id. Use only when the user explicitly asks to message a recipient; resolve a handle with twitter_user_info first, and use twitter_dm_conversation to read an existing thread. Requires a write-capable session, is not silently reversible, and can need a residential proxy because X may reject datacenter writes.",
    shape: {
      recipient_id: z.string().describe(
        "Numeric Twitter/X user id of the recipient (e.g. '44196397'). Resolve a @handle to its id with twitter_user_info first. The recipient must allow DMs from you.",
      ),
      text: z.string().min(1).describe(
        "The Direct Message body text to send (non-empty).",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_create_tweet",
    path: "/twitter/tweet/create",
    method: "POST",
    write: true,
    description:
      "Publish a new X post from the authenticated account and return its post ID and URL. Use only when the user explicitly asks to post, reply, or quote-post; set reply_to or quote for those neighboring actions, and upload media first if media_ids are needed. This is public, requires a write-capable session, and can only be reversed by deleting the post.",
    shape: {
      text: z.string().min(1).describe(
        "The tweet body text (1 to 280 characters, or longer if the account has extended limits).",
      ),
      reply_to: z.string().optional().describe(
        "Optional. Numeric id of the tweet to reply to. When set, this tweet is posted as a reply in that conversation.",
      ),
      quote: z.string().optional().describe(
        "Optional. Numeric id of the tweet to quote. When set, this tweet quote-tweets that tweet.",
      ),
      media_ids: z.string().optional().describe(
        "Optional. Comma-separated media id(s) from a prior media upload to attach (images/video).",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_delete_tweet",
    path: "/twitter/tweet/delete",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Permanently delete a post authored by the authenticated X account. Use only when the user explicitly asks to remove that post; provide its ID or full URL, and do not use this for undoing a like, repost, or bookmark. Requires a write-capable session and is irreversible.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_favorite_tweet",
    path: "/twitter/tweet/favorite",
    method: "POST",
    write: true,
    description:
      "Like an X post from the authenticated account. Use only when the user explicitly asks to like or favorite a specific post; provide its ID or URL and use twitter_unfavorite_tweet to remove that like. Requires a write-capable session.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_unfavorite_tweet",
    path: "/twitter/tweet/unfavorite",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Remove the authenticated account's like from an X post. Use only when the user explicitly asks to unlike or unfavorite a specific post; provide its ID or URL and use twitter_favorite_tweet for the inverse action. Requires a write-capable session.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_retweet",
    path: "/twitter/tweet/retweet",
    method: "POST",
    write: true,
    description:
      "Repost an X post from the authenticated account without adding commentary. Use only when the user explicitly asks to repost or retweet; use twitter_create_tweet with quote for a quote-post, and twitter_unretweet to undo this action. Requires a write-capable session.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_unretweet",
    path: "/twitter/tweet/unretweet",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Remove the authenticated account's repost of an X post. Use only when the user explicitly asks to undo a repost or retweet; provide the original post ID or URL and use twitter_retweet for the inverse action. Requires a write-capable session.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_bookmark_tweet",
    path: "/twitter/tweet/bookmark",
    method: "POST",
    write: true,
    description:
      "Save an X post to the authenticated account's private bookmarks. Use only when the user explicitly asks to bookmark or save a specific post; use twitter_bookmark_tweet for saving, twitter_bookmarks for reading saved posts, and twitter_unbookmark_tweet to undo. Requires a write-capable session.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_unbookmark_tweet",
    path: "/twitter/tweet/unbookmark",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Remove an X post from the authenticated account's private bookmarks. Use only when the user explicitly asks to unsave a specific post; provide its ID or URL and use twitter_bookmark_tweet for the inverse action. Requires a write-capable session.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_follow_user",
    path: "/twitter/user/follow",
    method: "POST",
    write: true,
    description:
      "Follow an X account from the authenticated account. Use only when the user explicitly asks to follow someone; resolve the handle to numeric user_id with twitter_user_info, and use twitter_unfollow_user to reverse the action. Requires a write-capable session.",
    shape: {
      user_id: z.string().describe(
        "Numeric user id of the account to follow. Resolve a handle to a user_id first with twitter_user_info.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_unfollow_user",
    path: "/twitter/user/unfollow",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Unfollow an X account from the authenticated account. Use only when the user explicitly asks to stop following someone; resolve the handle to numeric user_id with twitter_user_info, and use twitter_follow_user for the inverse action. Requires a write-capable session.",
    shape: {
      user_id: z.string().describe(
        "Numeric X user ID of the account to unfollow, normally returned by twitter_user_info for the user's handle.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_list_add_member",
    path: "/twitter/list/add_member",
    method: "POST",
    write: true,
    description:
      "Add one account to a Twitter/X List that YOUR registered X session owns, by numeric list id and numeric user id. Use it to curate a List from code, for example adding each speaker at a conference to a List as they are announced. Returns ok, action, list_id, user_id, the List's member_count read back from X after the write, and the full list object. Read member_count to confirm the change landed: it is null when X returned no list object at all, which is itself the not-applied signal. A write that does not apply (the account is already a member, the List is not yours) comes back with the SAME field layout plus a 422 and a machine-readable reason, and is not billed. Reverse with twitter_list_remove_member.",
    shape: {
      list_id: z.string().describe(
        "Numeric id of the List you own. Found in the list URL: x.com/i/lists/<list_id>.",
      ),
      user_id: z.string().describe(
        "Numeric user id of the account to add. Resolve a handle to a user_id first with twitter_user_info.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_list_remove_member",
    path: "/twitter/list/remove_member",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Remove one account from a Twitter/X List that YOUR registered X session owns, by numeric list id and numeric user id. Use it to prune a curated List, for example dropping accounts that have gone quiet. Returns ok, action, list_id, user_id, the List's member_count read back from X after the write, and the full list object. Read member_count to confirm the removal landed: it is null when X returned no list object at all, which is itself the not-applied signal. A write that does not apply (the account was never a member, the List is not yours) comes back with the SAME field layout plus a 422 and a machine-readable reason, and is not billed. Reverse with twitter_list_add_member.",
    shape: {
      list_id: z.string().describe(
        "Numeric id of the List you own. Found in the list URL: x.com/i/lists/<list_id>.",
      ),
      user_id: z.string().describe(
        "Numeric user id of the account to remove. Resolve a handle to a user_id first with twitter_user_info.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_list_create",
    path: "/twitter/list/create",
    method: "POST",
    write: true,
    description:
      "Create a new Twitter/X List owned by YOUR registered X session, with a name and an optional description and privacy flag. This is the starting point for building a List from code: create it here, then fill it with twitter_list_add_member using the list id this returns. Returns ok, action, the new list_id, member_count, and the full list object X returned. A List is PUBLIC unless you explicitly ask for a private one, and a private List is not readable by the public List read tools (twitter_list_members, twitter_list_tweets, twitter_list_timeline).",
    shape: {
      name: z.string().min(1).describe(
        "Display name for the new List, e.g. \"Founders\". Required; an empty or whitespace-only name is rejected with a 400.",
      ),
      description: z.string().optional().describe(
        "Optional. Description shown on the List, e.g. \"People building in public\". Defaults to empty.",
      ),
      is_private: z.string().optional().describe(
        "Optional. Pass the string \"true\" to create a PRIVATE List. Defaults to false (public), because a public List can be made private later while a leak cannot be undone. Note a private List is not readable by the public List read tools.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_customer_session",
    path: "/twitter/customer/session",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Register an existing logged-in X browser session so authenticated reads, Grok, and write tools act as that account; returns the resolved username and live validation state without returning the stored cookies. Use when the user wants to connect X with auth_token and ct0 cookies; use twitter_user_login instead for username and password, or per-call cookie parameters when the session should not be stored. Treat the cookies as secrets, and use twitter_customer_session_status to verify the linked identity afterward.",
    shape: {
      auth_token: z.string().describe(
        "Your x.com auth_token cookie value, from a logged-in browser session. Stored server-side against your key; never returned.",
      ),
      ct0: z.string().describe(
        "Your x.com ct0 (CSRF) cookie value, from the same browser session. Paired with auth_token.",
      ),
      user_agent: z.string().optional().describe(
        "Optional. Browser User-Agent to send with this session's requests. Defaults to a current Chrome UA.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional. HTTP or SOCKS proxy URL to route this session's traffic through, e.g. 'http://user:pass@host:port'.",
      ),
    },
  },
  {
    name: "twitter_customer_session_status",
    path: "/twitter/customer/session/status",
    description:
      "Inspect the X session registered to this API key without changing it; returns whether one exists, its resolved username and user ID, health, timestamps, and egress source, but never cookies or proxy URLs. Use when the user asks which account is connected, whether its session expired, or whether its proxy is active; call it after twitter_customer_session or twitter_user_login to verify setup. It is free and cannot inspect another API key's session.",
    shape: {},
  },
  {
    name: "twitter_customer_session_delete",
    path: "/twitter/customer/session/delete",
    method: "POST",
    write: true,
    description:
      "Delete the X session cookies stored for this API key, stopping authenticated tools from acting as that account; returns ok and whether anything was deleted. Use when the user asks to disconnect or log out this connector; the call is free and idempotent, but it removes only the stored copy and does not invalidate the browser session on x.com. To revoke the cookies themselves, the user must also remove that session in X account settings.",
    shape: {},
  },
  {
    name: "twitter_user_login",
    path: "/twitter/user/user_login",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Log in to X with account credentials and store the resulting session for authenticated reads, Grok, and writes; returns ok, username, and message, but never the minted cookies. Use when the user wants to connect with username and password; use twitter_customer_session when they provide existing browser cookies, then verify with twitter_customer_session_status. Add totp_secret for 2FA, expect captcha or account-confirmation challenges to require user action, and never echo or log credentials.",
    shape: {
      username: z.string().describe(
        "The X account username/handle (without the leading @). Some accounts also accept the login email here.",
      ),
      password: z.string().describe(
        "The X account password.",
      ),
      totp_secret: z.string().optional().describe(
        "The account's base32 two-factor (TOTP) secret. Required only when the account has 2FA enabled.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional. HTTP or SOCKS proxy URL to perform the login through, e.g. 'http://user:pass@host:port'. Stored with the session and reused for its later requests. Omit to log in directly from the service's own IP. A residential proxy is recommended: X treats datacenter logins as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional. Browser User-Agent to mint and use the session with. Defaults to a current Chrome UA. Keep it consistent with the environment the account normally signs in from; a mismatch between the UA and the session is itself a signal to X.",
      ),
    },
  },
  {
    name: "twitter_media_upload",
    path: "/twitter/media/upload",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Upload base64-encoded image bytes to the authenticated X account and return media_id. Use when the user explicitly asks to publish an image: upload first, then pass the returned ID to twitter_create_tweet or an article cover tool; this tool does not publish a post by itself. Requires a registered or per-call session and supports image data only.",
    shape: {
      media_data: z.string().describe(
        "Base64-encoded image bytes to upload. Sent in the JSON request body.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_media_status",
    path: "/twitter/media/status",
    description:
      "Check an uploaded X media item's processing state, progress, retry delay, and failure details. Use after twitter_media_upload for asynchronous video, GIF, or large-media processing, and do not attach the media until state is 'succeeded'; wait check_after_secs before polling again. Use the same registered or per-call session that uploaded the media; this check is read-only.",
    shape: {
      media_id: z.string().describe(
        "Numeric media id returned by twitter_media_upload, e.g. '1234567890123456789'.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_create",
    path: "/twitter/article/create",
    method: "POST",
    write: true,
    description:
      "Create an empty draft X Article and return its article ID plus full object. Use when the user explicitly asks to start a long-form article; then pass the ID to title, content, cover, publish, or delete tools. This does not publish anything and requires a write-capable session.",
    shape: {
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_update_cover_media",
    path: "/twitter/article/update_cover_media",
    method: "POST",
    write: true,
    description:
      "Set an already uploaded image as an X Article's cover and return the updated article. Use when the user explicitly asks to add or replace a cover; obtain article id from twitter_article_create or twitter_article_list and media_id from twitter_media_upload first. This tool does not upload media and requires a write-capable session.",
    shape: {
      id: z.string().describe(
        "The article's entity id, from twitter_article_create or twitter_article_list (e.g. 'ArticleEntity:1234567890123456789').",
      ),
      media_id: z.string().describe(
        "The media id returned by twitter_media_upload for the image to use as the cover.",
      ),
      media_category: z.string().optional().describe(
        "Optional. X's media category for the upload. Defaults to 'DraftTweetImage', which is what X's own article editor sends for a cover image. Only set this if you know X expects a different category.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_update_title",
    path: "/twitter/article/update_title",
    method: "POST",
    write: true,
    description:
      "Set or replace the title of a draft or published X Article and return the updated article. Use when the user explicitly asks to change a title; obtain article id from twitter_article_create or twitter_article_list. This does not change article body content and requires a write-capable session.",
    shape: {
      id: z.string().describe(
        "The article's entity id, from twitter_article_create or twitter_article_list (e.g. 'ArticleEntity:1234567890123456789').",
      ),
      title: z.string().min(1).describe(
        "The new article title (non-empty).",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_update_content",
    path: "/twitter/article/update_content",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Replace a draft or published X Article's body with caller-supplied Draft.js content_state and return the updated article. Use only when the user explicitly asks to change article content and valid { blocks, entityMap } JSON is available; obtain article id from twitter_article_create or twitter_article_list. The tool passes content through without constructing or validating it and requires a write-capable session.",
    shape: {
      id: z.string().describe(
        "The article's entity id, from twitter_article_create or twitter_article_list.",
      ),
      content_state: z.record(z.string(), z.unknown()).describe(
        "Draft.js content state object: { blocks: [...], entityMap: [...] }. You construct this JSON yourself (it is the same shape the X Article editor produces); it is passed through to X verbatim and not validated here.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_publish",
    path: "/twitter/article/publish",
    method: "POST",
    write: true,
    description:
      "Publish a draft X Article and create its real public announcement post, returning the published article object. Use only when the user clearly asks to publish after title and content are ready; confirm if intent is ambiguous, because twitter_article_unpublish leaves the announcement post visible and only twitter_article_delete also removes it. Requires a write-capable session; audience and reply control default to Everyone, and caption is limited to 256 characters.",
    shape: {
      id: z.string().describe(
        "The article's entity id, from twitter_article_create or twitter_article_list. Must currently be a Draft.",
      ),
      audience: z.string().optional().describe(
        "Optional. Who can see the published article, e.g. 'Everyone'. Defaults to 'Everyone' when omitted.",
      ),
      reply_control: z.string().optional().describe(
        "Optional. Who can reply to the announcement tweet, e.g. 'Everyone'. Defaults to 'Everyone' when omitted.",
      ),
      caption: z.string().optional().describe(
        "Optional. Short caption text for the announcement tweet, up to 256 characters.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_unpublish",
    path: "/twitter/article/unpublish",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Return a published X Article to draft state and return the updated draft. Use only when the user explicitly asks to unpublish while leaving the announcement post visible; use twitter_article_delete when that public post must also be removed. The article must currently be published, and the action requires a write-capable session.",
    shape: {
      id: z.string().describe(
        "The article's entity id, from twitter_article_create or twitter_article_list. Must currently be Published.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_get",
    path: "/twitter/article/get",
    description:
      "Read an X Article's title, body state, cover media URL, author, timestamps, and public URL. Use the announcement post ID or URL for a public published article, or use article_id from twitter_article_create or twitter_article_list with an authenticated session to read your own draft; provide exactly one identifier form. A not-found result can mean absent, invisible, unpublished, or not owned, and cover media URLs are metadata rather than model-readable image contents.",
    shape: {
      id: z.string().optional().describe(
        "Numeric X post ID as a string, usually supplied by the user or returned by another X tool. Provide exactly one of id or url.",
      ),
      url: z.string().optional().describe(
        "Full X post URL in the form https://x.com/<handle>/status/<id>. Provide exactly one of id or url; use this form when the user supplied a post link.",
      ),
      article_id: z.string().optional().describe(
        "OWNER-ONLY form. The article's own entity id, from twitter_article_create or twitter_article_list (e.g. 'ArticleEntity:1234567890123456789', or the bare numeric rest_id). Requires an authenticated session. Provide exactly one of id, url, or article_id.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_list",
    path: "/twitter/article/list",
    description:
      "List the authenticated X account's articles for one lifecycle, returning article objects, count, and pagination. Use when the user asks for their drafts or published articles, or when another article tool needs article ID; X has no combined view, so call once for draft and once for published when both are needed. Requires a registered session, and omitted lifecycle means draft.",
    shape: {
      lifecycle: z.enum(["draft","published"]).optional().describe(
        "Which lifecycle to list: 'draft' or 'published'. Defaults to 'draft' when omitted. X has no combined view, list each lifecycle separately.",
      ),
      count: z.number().int().min(1).max(100).optional().describe(
        "Max articles to return for this page, 1 to 100. Defaults to 20 when omitted.",
      ),
      cursor: z.string().optional().describe(
        "Opaque string from the previous response's next_cursor field. Omit it on the first call, then pass it unchanged to fetch the next page.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_article_delete",
    path: "/twitter/article/delete",
    method: "POST",
    write: true,
    destructive: true,
    description:
      "Permanently delete an X Article; a published article is unpublished and its announcement post is also deleted, while a draft is removed directly. Use only when the user explicitly asks for full removal; use twitter_article_unpublish if the announcement post should remain, and obtain the article ID plus optional lifecycle and tweet_id hints from twitter_article_list. This action is irreversible and requires a write-capable session.",
    shape: {
      id: z.string().describe(
        "The article's entity id, from twitter_article_create or twitter_article_list.",
      ),
      lifecycle: z.enum(["draft","published"]).optional().describe(
        "Optional fast-path hint: 'draft' or 'published', if you already know it. Omit to let the server resolve it (slower, one extra lookup).",
      ),
      tweet_id: z.string().optional().describe(
        "Optional fast-path hint: the announcement tweet id, only meaningful when lifecycle is 'published'. Omit to let the server resolve it from your own article list.",
      ),
      auth_token: z.string().optional().describe(
        "Optional auth_token cookie value from the X account's logged-in browser session. Pair it with ct0 to act as that account for this call; omit both to use the session registered with twitter_customer_session or twitter_user_login.",
      ),
      ct0: z.string().optional().describe(
        "Optional ct0 cookie value from the same logged-in X browser session as auth_token. Provide both cookie values together, or omit both to use the registered session.",
      ),
      proxy_url: z.string().optional().describe(
        "Optional HTTP or SOCKS proxy URL, such as http://user:pass@host:port, for this call's X traffic. Prefer a residential proxy for writes because X can reject datacenter traffic as automated.",
      ),
      user_agent: z.string().optional().describe(
        "Optional browser User-Agent string for this call. Keep it consistent with the account's normal browser session; omit it to use the registered or default value.",
      ),
    },
  },
  {
    name: "twitter_monitor_create",
    path: "/twitter/monitor",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Create a monitor that watches one X handle for new posts and delivers signed events to registered webhooks; returns monitor ID, normalized handle, status, and poll interval. Use when the user asks for ongoing post monitoring, normally after twitter_monitor_webhook_create; this is different from a one-time search or timeline read. The call is free, and optional webhook IDs or domain_filter can narrow delivery.",
    shape: {
      handle: z.string().min(1).describe(
        "The X username to watch, without the leading @ (e.g. 'elonmusk').",
      ),
      webhook_ids: z.string().optional().describe(
        "Optional. Comma-separated webhook id(s) from twitter_monitor_webhook_create to restrict this monitor's deliveries to. Omit to deliver to every active webhook on the account (the default).",
      ),
      domain_filter: z.string().optional().describe(
        "Optional. A bare hostname ('example.com') or a full URL ('https://example.com/blog') to restrict delivery to only the new posts that link to that host or a subdomain of it (e.g. 'example.com' matches both example.com and blog.example.com). Normalized server-side: lowercased, scheme/path/query/fragment/leading www./trailing :port stripped. Omit for no filter, the default (deliver every new post). Rejected with a 400 if what remains after normalization is not a valid hostname shape. A post with no matching link is filtered out of delivery, never silently dropped: it still advances the monitor's cursor and counts toward the account's tweets_domain_filtered health metric.",
      ),
    },
  },
  {
    name: "twitter_monitor_list",
    path: "/twitter/monitor",
    description:
      "List all configured X monitors with IDs, watched subjects, active or paused state, degradation, possible missed events, webhook restrictions, and creation times. Use when the user asks what is being monitored or when update, delete, or health tools need a monitor ID; use twitter_monitor_account_health for aggregate service health. This free call takes no arguments.",
    shape: {},
  },
  {
    name: "twitter_monitor_update",
    path: "/twitter/monitor/{id}",
    method: "POST",
    write: true,
    jsonBody: true,
    pathParams: ["id"],
    description:
      "Partially update one X monitor's active state, webhook restrictions, or domain filter in one atomic call. Use when the user asks to pause, resume, or reroute an existing monitor; obtain id from twitter_monitor_create or twitter_monitor_list, and omit fields that should remain unchanged. Resuming rechecks capacity limits, and the call is free.",
    shape: {
      id: z.string().describe(
        "The monitor's id, from twitter_monitor_create or twitter_monitor_list.",
      ),
      status: z.enum(["active","paused"]).optional().describe(
        "'paused' to pause the monitor, 'active' to resume it. Omit to leave status unchanged.",
      ),
      webhook_ids: z.string().optional().describe(
        "Optional. Comma-separated webhook id(s) to restrict delivery to. Pass an empty string to clear the restriction back to 'deliver to every active webhook'. Omit entirely to leave it unchanged.",
      ),
      domain_filter: z.string().nullable().optional().describe(
        "Optional. A bare hostname or full URL to restrict delivery to, same shape and normalization as twitter_monitor_create's domain_filter. Pass an empty string (or null) to clear an existing filter back to 'deliver every new post'. Omit entirely to leave the current filter unchanged. Rejected with a 400 if a non-empty value does not normalize to a valid hostname.",
      ),
    },
  },
  {
    name: "twitter_monitor_delete",
    path: "/twitter/monitor/{id}",
    method: "DELETE",
    write: true,
    destructive: true,
    pathParams: ["id"],
    description:
      "Stop and permanently remove one X monitor while retaining its delivery history. Use only when the user explicitly asks to stop monitoring that subject; obtain id from twitter_monitor_create or twitter_monitor_list, and create a new monitor if monitoring must resume later. The call is free.",
    shape: {
      id: z.string().describe(
        "The monitor's id, from twitter_monitor_create or twitter_monitor_list.",
      ),
    },
  },
  {
    name: "twitter_monitor_health",
    path: "/twitter/monitor/{id}/health",
    pathParams: ["id"],
    description:
      "Get one monitor's current state, degradation, poll interval, possible missed-event count, and cursor position. Use when the user asks whether a specific monitor is healthy or current; obtain id from twitter_monitor_create or twitter_monitor_list, and use twitter_monitor_account_health for an account-wide rollup. The call is free.",
    shape: {
      id: z.string().describe(
        "The monitor's id, from twitter_monitor_create or twitter_monitor_list.",
      ),
    },
  },
  {
    name: "twitter_monitor_account_health",
    path: "/twitter/monitor/health",
    description:
      "Get account-wide monitoring health, including operational or degraded state, active and paused monitor counts, and 24-hour pending, delivered, and failed delivery totals. Use when the user asks whether the monitoring service or all monitors are healthy; use twitter_monitor_health for one monitor's cursor details. This free call takes no arguments and returns zeroed counts when no monitors exist.",
    shape: {},
  },
  {
    name: "twitter_monitor_deliveries",
    path: "/twitter/monitor/deliveries",
    description:
      "List recent monitor delivery events across all monitors, including monitor and post IDs, status, post time, detection latency, delivery latency, and total latency. Use when the user asks which events were delivered, failed, or delayed; use health tools for summarized status rather than event-level records. This free call returns newest events first.",
    shape: {
      limit: z.number().int().min(1).max(200).optional().describe(
        "Max delivery events to return, 1 to 200. Defaults to 50 when omitted.",
      ),
    },
  },
  {
    name: "twitter_x_user_stream_add_user",
    path: "/oapi/x_user_stream/add_user_to_monitor_tweet",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Create an X post monitor through the legacy x_user_stream-compatible request and response shape. Use only when the user is maintaining an existing x_user_stream integration; prefer twitter_monitor_create for new work because both reach the same monitor system. The call is free.",
    shape: {
      x_user_name: z.string().describe(
        "The X username to watch, without the @.",
      ),
    },
  },
  {
    name: "twitter_x_user_stream_remove_user",
    path: "/oapi/x_user_stream/remove_user_to_monitor_tweet",
    method: "POST",
    write: true,
    destructive: true,
    jsonBody: true,
    description:
      "Remove an X post monitor through the legacy x_user_stream-compatible shape. Use only when the user is maintaining that compatibility integration; obtain id_for_user from twitter_x_user_stream_list_users, and prefer twitter_monitor_delete for new work. The removal is irreversible and free.",
    shape: {
      id_for_user: z.string().describe(
        "The monitor id, from twitter_x_user_stream_list_users. Same value as a twitter_monitor_* tool's monitor id.",
      ),
    },
  },
  {
    name: "twitter_x_user_stream_list_users",
    path: "/oapi/x_user_stream/get_user_to_monitor_tweet",
    description:
      "List configured X post monitors through the legacy x_user_stream-compatible response shape. Use only for an existing compatibility integration or to obtain id_for_user for its remove tool; prefer twitter_monitor_list for new work. x_user_id is always null and is_monitor_profile is always 0 because profile-change monitoring is unsupported.",
    shape: {},
  },
  {
    name: "twitter_monitor_webhook_create",
    path: "/twitter/webhook",
    method: "POST",
    write: true,
    jsonBody: true,
    description:
      "Register a public HTTPS endpoint for signed monitor events and return its webhook ID plus a one-time HMAC secret. Use when the user asks to configure monitor delivery, normally before twitter_monitor_create; store the secret immediately because twitter_monitor_webhook_list cannot return it later. Private or local addresses are rejected, and the call is free.",
    shape: {
      url: z.string().min(1).describe(
        "Your https delivery endpoint, e.g. 'https://example.com/webhooks/twitterapis'. Private, loopback, link-local, and metadata IPs are refused, re-checked at every delivery, not just at registration.",
      ),
    },
  },
  {
    name: "twitter_monitor_webhook_list",
    path: "/twitter/webhook",
    description:
      "List registered monitor webhooks with ID, URL, active or disabled state, and creation time. Use when the user asks where events are delivered or when delete and test tools need a webhook ID; this never returns the HMAC secret. A disabled webhook must be registered again, and this call is free.",
    shape: {},
  },
  {
    name: "twitter_monitor_webhook_delete",
    path: "/twitter/webhook/{id}",
    method: "DELETE",
    write: true,
    destructive: true,
    pathParams: ["id"],
    description:
      "Remove a monitor webhook so it immediately stops receiving events, while retaining delivery history. Use only when the user explicitly asks to disconnect that endpoint; obtain id from twitter_monitor_webhook_create or twitter_monitor_webhook_list, and register a new webhook to resume later. The removal is irreversible from the caller and free.",
    shape: {
      id: z.string().describe(
        "The webhook's id, from twitter_monitor_webhook_create or twitter_monitor_webhook_list.",
      ),
    },
  },
  {
    name: "twitter_monitor_webhook_test",
    path: "/twitter/webhook/{id}/test",
    method: "POST",
    write: true,
    pathParams: ["id"],
    description:
      "Send one signed test event to a registered webhook and return delivered, HTTP status, and error synchronously. Use when the user asks to verify endpoint reachability or signature handling before relying on monitor delivery; obtain id from the webhook create or list tool. This free diagnostic is one-shot and is never queued, retried, or dead-lettered.",
    shape: {
      id: z.string().describe(
        "The webhook's id, from twitter_monitor_webhook_create or twitter_monitor_webhook_list.",
      ),
    },
  },
];

// The query-string builder and the path-param substitution helper are
// hand-written logic, not catalog data, so they live in their own module and
// are re-exported here to keep this file's one import path.
export { buildQuery, resolvePathParams, MissingPathParamError } from "./query.js";
