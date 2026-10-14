# GitHub Pages performance and security

The origin remains GitHub Pages. Cloudflare rules are recorded separately in
`cloudflare/blog-rules.json`; a committed configuration is not proof that it is
active in the account.

## Build and deployment

`npm run build` renders the blog, builds the ball application, then finalizes
all HTML outputs. Finalization fills missing canonical/description/JSON-LD
metadata, adds local image dimensions and loading hints, and deduplicates the
sitemap. Nested pages are included. Authored locale markup is retained.

`lastmod` uses explicit post modification dates or source Git history, rather
than the build clock. CI therefore checks out full history. The snapshot's
observation date is independent of its publication/source modification date.

Before upload, CI runs `npm test` and `npm run check:output`. Actions are pinned
to the commits of the previously selected releases. npm lockfiles are retained.
Markdown permits authored HTML; article sources must remain trusted. Escaping
metadata does not sanitize deliberately authored HTML articles.

## Storage radar

The maintained source snapshot stays in `public/storage-radar/index.html`.
Finalization extracts an independently cacheable UI/data pair and JPEG avatars.
The UI dataset omits raw posts it does not read; `snapshot.json` preserves the
complete original data losslessly and is linked as an alternate representation.
The visible text summary is retained if JavaScript or data loading fails.

Asset URLs include content fingerprints. Stable physical JS/JSON paths avoid
404s when a cached HTML document outlives a Pages deployment; these files are
not advertised as immutable. Keep loader/data schema changes compatible with
the preceding release. The original release marker describes the source
snapshot, not the transformed HTML bytes.

## Cloudflare rules

Apply the rule definitions to this zone only, preserving unrelated rules. Only
public GET/HEAD document requests on the apex host become cache eligible.
Respect origin Cache-Control so private/no-store and Set-Cookie responses are
not forcibly cached. Cookie/Authorization requests, API paths, Cloudflare paths,
the negotiated map root, and explicit language selections bypass shared cache.
The English map has a distinct URL. The language Worker also sends private,
no-store and Vary on the negotiated Chinese root.

Response rules add a minimal enforced CSP (base/object/frame protections),
same-origin framing, referrer and permissions policies. A broader CSP is
report-only; it has no collection endpoint yet, so violations are visible in
browser diagnostics, not an aggregated monitoring service. Camera use remains
allowed on this origin for the WebAR page.

For each production change, verify public documents become MISS then HIT,
cookie/Authorization and language requests bypass cache, and no-store stays
effective. GitHub's existing max-age is 600 seconds. Without a purge credential,
deployments can take that long to replace an existing cached document; do not
claim instant cache invalidation. A future automated purge should use a
zone-scoped credential and run only after a successful Pages deployment.

## TLS prerequisite

An edge HTTPS certificate does not prove origin certificate verification.
GitHub must first issue a valid certificate for the custom domain before
Enforce HTTPS and Cloudflare Full (strict) are enabled. Do not enable strict
verification against an origin whose certificate does not match. Preserve
Cloudflare's existing visitor HTTPS redirect/HSTS during certificate work.
