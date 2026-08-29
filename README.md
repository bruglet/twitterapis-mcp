# TwitterAPIs Remote MCP

This fork runs the [twitterapis.com](https://www.twitterapis.com) API as a remote Model Context Protocol service. It keeps the upstream TwitterAPIs tools, schemas, and REST behavior.

## Remote MCP

Use the remote MCP URL with the `/mcp` path:

```text
https://<your-host>/mcp
```

Cloudflare Access handles OAuth before the request reaches this service. The origin validates the `Cf-Access-Jwt-Assertion` header. This service does not implement OAuth.

The public health endpoint is:

```text
https://<your-host>/healthz
```

## Configuration

Set these environment variables in the container or Quadlet environment file:

| Environment variable | Required | Default | Purpose |
|---|---|---|---|
| `TWITTERAPIS_KEY` | Yes | None | API key from the [twitterapis.com dashboard](https://www.twitterapis.com/dashboard) |
| `TWITTERAPIS_BASE_URL` | No | `https://api.twitterapis.com` | TwitterAPIs REST API host |
| `TWITTERAPIS_TIMEOUT_MS` | No | `30000` | Request timeout in milliseconds |
| `CF_ACCESS_TEAM_DOMAIN` | Yes | None | Cloudflare Access team URL, for example `https://example.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | Yes | None | Cloudflare Access application audience tag |
| `HOST` | No | `0.0.0.0` | HTTP listen address |
| `PORT` | No | `3000` | HTTP listen port |

## Container

Build the image:

```bash
podman build -f Containerfile -t ghcr.io/bruglet/twitterapis-mcp:latest .
```

Run the image with an environment file:

```bash
podman run --rm --env-file "$HOME/.config/twitterapis-mcp/twitterapis-mcp.env" -p 127.0.0.1:3000:3000 ghcr.io/bruglet/twitterapis-mcp:latest
```

The image uses Node 24, runs as the non-root `node` user, and includes a health check for `/healthz`. Do not put secrets in the image.

## Rootless Quadlet

The Quadlet publishes port `3000` on host loopback only. Cloudflare Tunnel connects to `http://127.0.0.1:3000`.

Copy the unit and create its environment file:

```bash
mkdir -p ~/.config/containers/systemd ~/.config/twitterapis-mcp
cp deploy/twitterapis-mcp.container ~/.config/containers/systemd/
cp deploy/twitterapis-mcp.env.example ~/.config/twitterapis-mcp/twitterapis-mcp.env
```

Edit the environment file. Then load and start the rootless unit:

```bash
systemctl --user daemon-reload
systemctl --user enable --now twitterapis-mcp.service
```

The unit uses `AutoUpdate=registry`, restarts after a failure, and loads secrets from the environment file.

## GHCR image

GitHub Actions publishes the image at:

```text
ghcr.io/bruglet/twitterapis-mcp
```

The workflow publishes `latest` and `sha-<commit>` for `main`. It also publishes the matching version tag for a version-tag push.

## Tools

64 registered tools: 60 reads and 4 allowed write actions. Most user endpoints accept `username` (handle without @) **or** `user_id` (`twitter_user_likes` and `twitter_user_tweets_complete` require `user_id`); tweet endpoints accept `id` **or** `url`; paginated endpoints return a `cursor` you pass back to get the next page. Two of the reads are free account/billing lookups (`twitter_account_me`, `twitter_account_payments`); the read-only monitoring tools are also free (account administration, not metered reads).

Public read tools work with just your API key. Account-only reads and 4 allowed write actions usually require a linked X session or per-call credentials. The allowed actions are `twitter_grok_chat`, `twitter_customer_session`, `twitter_customer_session_delete`, and `twitter_user_login`.

The complete upstream catalog contains 94 tools. This fork keeps all generated tool code, but it does not register the other 30 write actions. MCP clients cannot list or call those tools. The tables below preserve the complete upstream catalog for synchronization and attribution.

### Reads

| Tool | What it does |
|---|---|
| `twitter_advanced_search` | Search tweets with X operators (`from:`, `min_faves:`, `since:`, `filter:links`, etc.) |
| `twitter_user_search` | Find user accounts by name or keyword |
| `twitter_user_info` | Full profile by handle (bio, counts, verification, location) |
| `twitter_user_info_by_id` | Full profile by numeric user id |
| `twitter_user_status` | Is an account alive, suspended, or deleted |
| `twitter_user_about` | A user's structured About object (category, professional/business labels, verification + identity-verification flags, joined date, and X's 'About this account' transparency panel) |
| `twitter_user_affiliates` | Accounts affiliated with an organization profile |
| `twitter_check_follow_relationship` | Follow relationship between two user ids (who follows whom) |
| `twitter_user_tweets` | A user's recent original tweets (replies excluded) |
| `twitter_user_tweets_and_replies` | A user's full timeline (tweets + replies) |
| `twitter_user_tweets_complete` | A user's near-complete tweet history in one auto-paginated call |
| `twitter_user_media` | Images and videos a user has posted |
| `twitter_user_mentions` | Recent public tweets mentioning a user |
| `twitter_user_likes` | Tweets a user has liked (public Likes tab) |
| `twitter_user_followers` | Accounts that follow a user |
| `twitter_user_following` | Accounts a user follows |
| `twitter_user_followers_v2` | Followers with the v2 response shape (richer fields, deeper cursoring) |
| `twitter_user_following_v2` | Following with the v2 response shape (richer fields, deeper cursoring) |
| `twitter_user_verified_followers` | A user's verified followers only |
| `twitter_followers_you_know` | Followers of a target that your authenticated account also follows |
| `twitter_tweet_detail` | Single tweet: text, author, metrics, media, quoted/reply context |
| `twitter_tweet_replies` | Replies to a tweet |
| `twitter_tweet_thread` | Full author thread (connected tweet chain by same author) |
| `twitter_tweet_retweeters` | Accounts that retweeted a tweet |
| `twitter_tweet_quotes` | Tweets that quote a tweet, with their text. Search-backed, so `count` is what search returned, not the tweet's true `quote_count` |
| `twitter_list_members` | Members of a Twitter/X List |
| `twitter_list_followers` | Accounts that follow a public List (a different set from its members) |
| `twitter_list_tweets` | Posts by a List's members, search-backed: filterable by `since` / `until` date, `include_replies`, and `product` (Latest / Top), no retweets |
| `twitter_list_timeline` | A List's native X feed: retweets and X's own ordering included, no filters, paging only |
| `twitter_home_timeline` | Your authenticated account's Home timeline _(session)_ |
| `twitter_bookmarks` | Your authenticated account's bookmarks _(session)_ |
| `twitter_blocking` | Accounts your authenticated account has blocked (your own list only) _(session)_ |
| `twitter_muting` | Accounts your authenticated account has muted (your own list only) _(session)_ |
| `twitter_bookmark_search` | Full-text search within your bookmarks _(session)_ |
| `twitter_bookmark_folders` | Your authenticated account's bookmark folders _(session)_ |
| `twitter_bookmark_folder_timeline` | Tweets inside one of your bookmark folders, by `folder_id` _(session)_ |
| `twitter_dm_list` | Your DM conversations (inbox), read-only _(session)_ |
| `twitter_dm_conversation` | Messages in one DM conversation, read-only _(session)_ |
| `twitter_spaces_info` | Metadata and participant roster for one X Space, live or ended (by Space `id`) |
| `twitter_community_search` | Find X Communities by keyword; the discovery step that produces the numeric id the rest of the community family needs |
| `twitter_community_info` | One X Community by numeric id: name, counts, join policy, rules, topic, banners, admin |
| `twitter_community_about` | A community's moderators and a member preview, each returned as a full user profile, not the reduced row `_members`/`_moderators` return |
| `twitter_community_members` | A community's member roster, each row carrying that member's `Admin` / `Moderator` / `Member` role |
| `twitter_community_moderators` | A community's moderators and admins, from its own upstream operation (not a filter over the roster) |
| `twitter_community_tweets` | A community's post timeline, with the pinned post returned as its own `pinned` field |
| `twitter_community_memberships` | The inverse lookup: every community a given numeric `user_id` belongs to |
| `twitter_grok_chat` | Ask X's own Grok, grounded in live X data, and get the answer plus the sources it cited |
| `twitter_grok_config` | Whether the authenticated account can use Grok, and which models it may pick |
| `twitter_trends` | Current top trends for a location (by `country` or `woeid`) |
| `twitter_trends_locations` | Every location X has trends for, each with its WOEID |
| `twitter_account_me` | Your twitterapis.com account: credits, usage, email (free) |
| `twitter_account_payments` | Your twitterapis.com payment history (free) |
| `twitter_media_status` | Processing state of an uploaded `media_id`; poll until `succeeded` before attaching video or GIF _(session)_ |
| `twitter_article_get` | Read a **published** article's full content via its announcement tweet id/url (public, no session) |
| `twitter_article_list` | List your own articles, filtered by `lifecycle` (`draft` or `published`) _(session)_ |

### Write actions _(require a linked X session)_

| Tool | What it does |
|---|---|
| `twitter_create_tweet` | Post a tweet; set `reply_to` to reply or `quote` to quote-tweet |
| `twitter_delete_tweet` | Delete one of your tweets (irreversible) |
| `twitter_favorite_tweet` / `twitter_unfavorite_tweet` | Like / unlike a tweet |
| `twitter_retweet` / `twitter_unretweet` | Retweet / undo retweet |
| `twitter_bookmark_tweet` / `twitter_unbookmark_tweet` | Bookmark / remove bookmark |
| `twitter_follow_user` / `twitter_unfollow_user` | Follow / unfollow a user by id |
| `twitter_dm_send` | Send a Direct Message to a user by their numeric `recipient_id` |
| `twitter_list_create` | Create a Twitter/X List owned by your session (`name`, optional `description` / `is_private`) |
| `twitter_list_add_member` / `twitter_list_remove_member` | Add / remove one account on a List you own; `member_count` comes back as proof the write landed |
| `twitter_media_upload` | Upload a base64 image, returns a `media_id` for `twitter_create_tweet` |

### Articles _(X's long-form "Notes" feature; writes require a linked X session)_

| Tool | What it does |
|---|---|
| `twitter_article_create` | Start a new draft article, returns its `id` |
| `twitter_article_update_title` | Set a draft or published article's title |
| `twitter_article_update_cover_media` | Attach an already-uploaded image as an article's cover (`media_id` from `twitter_media_upload`) |
| `twitter_article_update_content` | Replace a draft or published article's body (Draft.js `content_state` you build) |
| `twitter_article_publish` | Publish a draft, posting a **real public announcement tweet** (not fully reversible) |
| `twitter_article_unpublish` | Revert a published article to draft (leaves the announcement tweet up) |
| `twitter_article_delete` | Delete an article (draft: hard delete; published: unpublish + delete the announcement tweet), irreversible |

See also `twitter_article_get` and `twitter_article_list` above.

### Monitoring _(webhook delivery of new posts; free, not metered)_

Watch an X account for new posts and get them pushed to your own HTTPS endpoint, HMAC-signed, instead of polling. Register a webhook first, then create a monitor; every new post from a watched handle is delivered to every active webhook on your account (or a restricted subset via `webhook_ids`). Monitor/webhook CRUD is account administration, not a metered Twitter read, so every tool below is free.

| Tool | What it does |
|---|---|
| `twitter_monitor_create` | Start watching an X account (`handle`) for new posts |
| `twitter_monitor_list` | List every monitor on your account |
| `twitter_monitor_update` | Pause/resume a monitor or change its `webhook_ids` restriction |
| `twitter_monitor_delete` | Stop and remove a monitor (irreversible) |
| `twitter_monitor_health` | One monitor's status, degradation flag, poll interval, cursor position |
| `twitter_monitor_account_health` | Account-wide rollup: service status, active/paused monitor counts, 24h delivery outcome counts, one call |
| `twitter_monitor_deliveries` | Recent delivery events across every monitor, with detection + delivery latency |
| `twitter_x_user_stream_add_user` | Compat drop-in for `twitter_monitor_create` using an x_user_stream-shaped envelope |
| `twitter_x_user_stream_remove_user` | Compat drop-in for `twitter_monitor_delete` using an x_user_stream-shaped envelope |
| `twitter_x_user_stream_list_users` | Compat drop-in for `twitter_monitor_list` using an x_user_stream-shaped envelope |
| `twitter_monitor_webhook_create` | Register an HTTPS delivery URL; returns the HMAC signing secret **once** |
| `twitter_monitor_webhook_list` | List every webhook registered on your account |
| `twitter_monitor_webhook_delete` | Soft-delete a webhook by id (irreversible from the caller's side) |
| `twitter_monitor_webhook_test` | Send one signed test event to a webhook right now, synchronously |

### Session setup

Link an X account to your key once, so the account-only reads and write actions act as it (or pass per-call `auth_token`/`ct0` instead).

| Tool | What it does |
|---|---|
| `twitter_customer_session` | Register your x.com session cookies (`auth_token` + `ct0`) against your key |
| `twitter_customer_session_delete` | Revoke that stored session, deleting your `auth_token` + `ct0` from the service. Idempotent and free |
| `twitter_user_login` | Log in with `username` + `password` (+ `totp_secret` for 2FA); stores the session against your key. Returns a confirmation, never the cookies |

## Upstream attribution

This fork is based on [TwitterAPIs/twitterapis-mcp](https://github.com/TwitterAPIs/twitterapis-mcp). It keeps the upstream MIT license, tool catalog, and TwitterAPIs behavior.

`src/tools.js` is **generated**. Do not edit it. The catalog is built at build time from two committed inputs:

- `test/openapi.snapshot.json`, a vendored copy of the published OpenAPI spec, which supplies the structure: which endpoints exist, which parameters each accepts, whether a parameter is required, and its type.
- `scripts/tools.overrides.mjs`, hand-authored, which supplies everything the spec cannot express: the tool and argument descriptions a model reads to decide how to call a tool, the cross-field rules ("provide exactly one of `username` or `user_id`"), the per-call credential arguments that travel as `x-*` headers, and the write / destructive / JSON-body flags.

The spec is vendored on purpose. Nothing is fetched at install time or at server boot, so the service does not depend on a hostname still answering.

```bash
npm run openapi:refresh   # re-vendor the spec, prints the route diff
npm run build             # regenerate src/tools.js
npm test                  # gates, incl. "src/tools.js matches the generator"
```

`npm test` fails if `src/tools.js` was hand-edited or left stale, if the catalog and the live spec disagree, or if the tool list and this README disagree.

## License

MIT
