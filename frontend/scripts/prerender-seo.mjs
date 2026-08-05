import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routeSeo, siteName } from "../src/config/siteRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const indexPath = path.join(distDir, "index.html");
const siteUrl = "https://www.aksharaaschool.edu.np";
const defaultImage = `${siteUrl}/akasharalogo.png`;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fullTitle(title) {
  if (!title) return siteName;
  return title.includes(siteName) ? title : `${title} | ${siteName}`;
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function applyMeta(html, route) {
  const title = escapeHtml(fullTitle(route.title));
  const description = escapeHtml(route.description || "");
  const keywords = escapeHtml(route.keywords || "Aksharaa School, Best School in Kathmandu, Progressive Education Nepal");
  const url = `${siteUrl}${route.path === "/" ? "/" : route.path}`;

  let next = html;
  next = replaceTag(next, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  next = replaceTag(next, /<meta name="title" content="[^"]*"\s*\/>/, `<meta name="title" content="${title}" />`);
  next = replaceTag(next, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`);
  next = replaceTag(next, /<meta name="keywords" content="[^"]*"\s*\/>/, `<meta name="keywords" content="${keywords}" />`);
  next = replaceTag(next, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  next = replaceTag(next, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`);
  next = replaceTag(next, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`);
  next = replaceTag(next, /<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${defaultImage}" />`);

  if (!/<meta name="twitter:card"/.test(next)) {
    next = next.replace(
      "<!-- CSS Preloads & Fonts -->",
      `<meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:url" content="${url}" />\n    <meta name="twitter:title" content="${title}" />\n    <meta name="twitter:description" content="${description}" />\n    <meta name="twitter:image" content="${defaultImage}" />\n\n    <!-- CSS Preloads & Fonts -->`,
    );
  } else {
    next = replaceTag(next, /<meta name="twitter:url" content="[^"]*"\s*\/>/, `<meta name="twitter:url" content="${url}" />`);
    next = replaceTag(next, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`);
    next = replaceTag(next, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
    next = replaceTag(next, /<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${defaultImage}" />`);
  }

  return next;
}

const template = await readFile(indexPath, "utf8");

for (const route of routeSeo) {
  const html = applyMeta(template, route);

  if (route.path === "/") {
    await writeFile(indexPath, html);
    continue;
  }

  const outputDir = path.join(distDir, route.path.replace(/^\//, ""));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), html);
}

console.log(`Prerendered SEO HTML for ${routeSeo.length} routes.`);
