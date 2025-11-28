export function htmlTemplate({ title, content, css, description = '', url = '', date = '', isArticle = false, jsonLd = null }) {
  const siteName = '王雨峰的博客';
  const siteUrl = 'https://wangyufeng.org';
  const defaultDescription = '王雨峰的个人博客，分享编程、生活与思考';
  const desc = description || defaultDescription;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = `${siteUrl}/avatar.jpg`;

  const jsonLdScript = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${fullUrl}">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>">

  <!-- Open Graph -->
  <meta property="og:type" content="${isArticle ? 'article' : 'website'}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="zh_CN">
  ${isArticle && date ? `<meta property="article:published_time" content="${date}">` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${ogImage}">

  ${jsonLdScript}
  <style>${css}</style>
</head>
<body>
  <div id="root">${content}</div>
</body>
</html>`;
}
