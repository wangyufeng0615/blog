const ZH_URL = "https://wangyufeng.org/land-below-the-wind/";
const EN_URL = "https://wangyufeng.org/land-below-the-wind/en/";
const LANGUAGE_COOKIE = "lbw_lang";

export function preferredLanguage(acceptLanguage) {
  if (!acceptLanguage?.trim()) return null;
  const candidates = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const parsedQuality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return {
        tag: tag.toLowerCase(),
        quality: Number.isFinite(parsedQuality) ? Math.max(0, Math.min(1, parsedQuality)) : 0,
        index,
      };
    })
    .filter((candidate) => candidate.tag && candidate.quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index);

  if (!candidates.length) return null;
  return candidates[0].tag === "zh" || candidates[0].tag.startsWith("zh-") ? "zh" : "en";
}

function cookieLanguage(request) {
  const cookie = request.headers.get("Cookie") || "";
  const value = cookie
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([name]) => name === LANGUAGE_COOKIE)?.[1];
  return value === "zh" || value === "en" ? value : null;
}

function cleanLanguageUrl(url, language) {
  url.searchParams.delete("lang");
  const target = new URL(language === "en" ? EN_URL : ZH_URL);
  target.search = url.search;
  return target;
}

function redirect(target, status, language = null) {
  const headers = new Headers({
    Location: target.toString(),
    "Cache-Control": "private, no-store",
    Vary: "Accept-Language, Cookie",
  });
  if (language) {
    headers.append(
      "Set-Cookie",
      `${LANGUAGE_COOKIE}=${language}; Path=/land-below-the-wind/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`
    );
  }
  return new Response(null, { status, headers });
}

export function languageRedirect(request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("lang");
  if (requested === "zh" || requested === "en") {
    return redirect(cleanLanguageUrl(url, requested), 308, requested);
  }

  if (url.pathname !== "/land-below-the-wind/" || url.search) return null;
  const selected = cookieLanguage(request) || preferredLanguage(request.headers.get("Accept-Language"));
  if (selected === "en") return redirect(new URL(EN_URL), 302);
  return null;
}

function addLanguageHeaders(response, language) {
  const headers = new Headers(response.headers);
  headers.set("Content-Language", language);
  headers.append(
    "Link",
    `<${ZH_URL}>; rel="alternate"; hreflang="zh-CN", <${EN_URL}>; rel="alternate"; hreflang="en", <${ZH_URL}>; rel="alternate"; hreflang="x-default"`
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request) {
    const redirectResponse = languageRedirect(request);
    if (redirectResponse) return redirectResponse;

    const response = await fetch(request);
    const pathname = new URL(request.url).pathname;
    if (pathname === "/land-below-the-wind/") return addLanguageHeaders(response, "zh-CN");
    if (pathname === "/land-below-the-wind/en/") return addLanguageHeaders(response, "en");
    return response;
  },
};
