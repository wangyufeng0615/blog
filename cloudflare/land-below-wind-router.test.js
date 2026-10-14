import assert from "node:assert/strict";
import test from "node:test";
import { addLanguageHeaders, languageRedirect, preferredLanguage } from "./land-below-wind-router.js";

test("negotiates the highest-quality browser language", () => {
  assert.equal(preferredLanguage("zh-CN,zh;q=0.9,en;q=0.8"), "zh");
  assert.equal(preferredLanguage("en-US,en;q=0.9,zh;q=0.8"), "en");
  assert.equal(preferredLanguage("en;q=0.4,zh-CN;q=0.9"), "zh");
  assert.equal(preferredLanguage(""), null);
});

test("redirects an English browser from the default URL", () => {
  const request = new Request("https://wangyufeng.org/land-below-the-wind/", {
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  });
  const response = languageRedirect(request);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("Location"), "https://wangyufeng.org/land-below-the-wind/en/");
  assert.equal(response.headers.get("Set-Cookie"), null);
});

test("serves Chinese at the default URL for Chinese or headerless clients", () => {
  const chinese = new Request("https://wangyufeng.org/land-below-the-wind/", {
    headers: { "Accept-Language": "zh-CN,zh;q=0.9" },
  });
  const crawler = new Request("https://wangyufeng.org/land-below-the-wind/");
  assert.equal(languageRedirect(chinese), null);
  assert.equal(languageRedirect(crawler), null);
});

test("manual language selection becomes a clean permanent URL and cookie", () => {
  const request = new Request("https://wangyufeng.org/land-below-the-wind/?lang=en&utm_source=test");
  const response = languageRedirect(request);
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("Location"), "https://wangyufeng.org/land-below-the-wind/en/?utm_source=test");
  assert.match(response.headers.get("Set-Cookie"), /^lbw_lang=en;/);
});

test("an explicit Chinese cookie overrides an English browser at the default URL", () => {
  const request = new Request("https://wangyufeng.org/land-below-the-wind/", {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      Cookie: "lbw_lang=zh",
    },
  });
  assert.equal(languageRedirect(request), null);
});

test("the negotiated root cannot be reused by a shared cache or a browser", () => {
  const original = new Response('中文', { headers: { 'Cache-Control': 'max-age=600' } });
  const zh = addLanguageHeaders(original, 'zh-CN');
  assert.equal(zh.headers.get('Cache-Control'), 'private, no-store');
  assert.match(zh.headers.get('Vary'), /Accept-Language, Cookie/);
  const en = addLanguageHeaders(new Response('English', { headers: { 'Cache-Control': 'max-age=600' } }), 'en');
  assert.equal(en.headers.get('Cache-Control'), 'max-age=600');
});
