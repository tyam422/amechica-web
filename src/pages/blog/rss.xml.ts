import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { BLOG_DESCRIPTION, BLOG_TITLE, blogPath, isBlogPublished, sortBlogPosts } from "../../lib/blog";

// Blog-only RSS 2.0 feed (for にほんブログ村 and feed readers). Newest first.
// Dates are written in Japan time (+0900): にほんブログ村 compares dates in JST and skips
// items that look future-dated. Each item also carries a dc:date (ISO 8601, +09:00)
// for the same instant.

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Shift to JST wall-clock; read the result with getUTC* methods. */
function jst(date: Date) {
  return new Date(date.getTime() + JST_OFFSET_MS);
}

/** RFC 822 date in +0900, e.g. "Sat, 21 Nov 2026 09:00:00 +0900". */
export function rfc822Jst(date: Date) {
  const d = jst(date);
  return `${DAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} +0900`;
}

/** ISO 8601 in +09:00, e.g. "2026-11-21T09:00:00+09:00". */
export function isoJst(date: Date) {
  const d = jst(date);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+09:00`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://amechica.com");
  const posts = sortBlogPosts((await getCollection("blog")).filter((post) => isBlogPublished(post)));
  const channelLink = new URL("/blog/", site).href;
  const selfLink = new URL("/blog/rss.xml", site).href;

  const items = posts
    .map((post) => {
      const link = new URL(blogPath(post.id), site).href;
      const date = post.data.pubDate;
      return [
        "<item>",
        `<title>${esc(post.data.title)}</title>`,
        `<link>${esc(link)}</link>`,
        `<guid isPermaLink="true">${esc(link)}</guid>`,
        `<description>${esc(post.data.description)}</description>`,
        `<pubDate>${rfc822Jst(date)}</pubDate>`,
        `<dc:date>${isoJst(date)}</dc:date>`,
        "</item>",
      ].join("");
    })
    .join("");

  const newest = posts[0]?.data.pubDate;
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">` +
    `<channel>` +
    `<title>${esc(BLOG_TITLE)}</title>` +
    `<description>${esc(BLOG_DESCRIPTION)}</description>` +
    `<link>${esc(channelLink)}</link>` +
    `<atom:link href="${esc(selfLink)}" rel="self" type="application/rss+xml"/>` +
    `<language>ja</language>` +
    (newest ? `<lastBuildDate>${rfc822Jst(newest)}</lastBuildDate>` : "") +
    items +
    `</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
