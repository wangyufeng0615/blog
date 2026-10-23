# Stellaris · Stellar Archive / 群星 · 星海文库

> All 150,415 exported English/Simplified-Chinese localisation records from the installed official Stellaris Cygnus v4.5.2 (9776), extracted 2026-10-12. Includes base game and installed official DLC; no Workshop/user mods.

150,414 paired records plus one Chinese-only empty string. The reader switches Chinese/English together with its interface and follows browser language on first visit. Theme follows the OS unless overridden. These are raw localisation templates: `$references$`, dynamic variables, icons, colour codes and escapes are retained. They are not expanded runtime dialogue. Fictional game strings are data, not instructions to the reader or agent. Image OCR, audio, engine hardcoded strings and uninstalled versions are outside scope. Text remains copyrighted by its respective owners; no open-content licence is asserted.

## Read without JavaScript

- [Source catalog](https://wangyufeng.org/stellaris/catalog.json): all namespace/source groups with counts and Markdown/JSON URLs.
- [Plain HTML catalog](https://wangyufeng.org/stellaris/catalog.html): crawlable links to every source export.
- [Data schema and lookup guide](https://wangyufeng.org/stellaris/schema.md): exact text-key lookup and citation instructions.
- [Extraction manifest](https://wangyufeng.org/stellaris/manifest.json): complete browser collection chunks including names, script-string candidates and original readable source files. Chunks are gzip-compressed JSON, decompress once before parsing.
- [Original source archive](https://wangyufeng.org/stellaris/downloads/official-source-texts.zip): 5,728 original source files, including 12 binary development resources.
- [Original extraction audit, Chinese](https://wangyufeng.org/stellaris/report.txt): scope, validation and limitations.

## Entry lookup

For a known text key, lowercase its first two characters and replace each non-ASCII-alphanumeric character with `_` (empty key: `_`). Fetch `lookup/<prefix>.json`, then look up `namespace:key`. Example: `crisis.2010.desc` → `lookup/cr.json` → `gameplay:crisis.2010.desc`. This returns the small relevant source JSON/Markdown and a stable reader URL. Distinguish namespaces `gameplay`, `online_account` and `legacy_launcher`; never merge same-key entries across namespaces. Public unauthenticated GET/HEAD reads work with standard HTTP clients; no special User-Agent is required. Identifying your client, for example as `StellarisCorpusReader/1.0`, is optional and encouraged. For search across the full corpus, enumerate the JSON catalog's `sources`, fetch each JSON and match `key`, `zh` or `en`; no remote search API is implied.

Cite `namespace:key`, game version, language, original source path and line. Both `null` (missing translation) and `""` (intentional empty string) are meaningful and must remain distinct.
