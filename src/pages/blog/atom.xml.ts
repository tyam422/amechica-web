import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { BLOG_ATOM_PATH, BLOG_DESCRIPTION, BLOG_TITLE, blogPath, isBlogPublished, lastModified, sortBlogPosts } from "../../lib/blog";

// Blog-only Atom 1.0 feed (RFC 4287), alongside the RSS 2.0 feed at /blog/rss.xml.
// Added at にほんブログ村 support's suggestion. Same posts and order as the RSS feed
// (newest first); all timestamps are written in Japan time (+09:00) for the same
// instants as the RSS pubDate / dc:date.

const AUTHOR_NAME = "amechica 管理人";
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const pad = (n: number) => String(n).padStart(2, "0");

/** ISO 8601 / RFC 3339 in +09:00, e.g. "2026-11-21T09:00:00+09:00" (same format as the RSS dc:date). */
function isoJst(date: Date) {
  const d = new Date(date.getTime() + JST_OFFSET_MS);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+09:00`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://amechica.com");
  const posts = sortBlogPosts((await getCollection("blog")).filter((post) => isBlogPublished(post)));
  const blogLink = new URL("/blog/", site).href;
  const selfLink = new URL(BLOG_ATOM_PATH, site).href;
  const authorUri = new URL("/about/", site).href;
  const author = `<author><name>${esc(AUTHOR_NAME)}</name><uri>${esc(authorUri)}</uri></author>`;

  const entries = posts
    .map((post) => {
      const link = new URL(blogPath(post.id), site).href;
      return [
        "<entry>",
        `<id>${esc(link)}</id>`,
        `<title type="text">${esc(post.data.title)}</title>`,
        `<link rel="alternate" type="text/html" href="${esc(link)}"/>`,
        `<published>${isoJst(post.data.pubDate)}</published>`,
        `<updated>${isoJst(lastModified(post))}</updated>`,
        `<summary type="text">${esc(post.data.description)}</summary>`,
        author,
        "</entry>",
      ].join("");
    })
    .join("");

  // Feed-level <updated>: the latest entry change (falls back to now if there are no posts).
  const latest = posts.reduce<Date | undefined>((acc, p) => {
    const d = lastModified(p);
    return !acc || d > acc ? d : acc;
  }, undefined);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">` +
    `<id>${esc(blogLink)}</id>` +
    `<title type="text">${esc(BLOG_TITLE)}</title>` +
    `<subtitle type="text">${esc(BLOG_DESCRIPTION)}</subtitle>` +
    `<updated>${isoJst(latest ?? new Date())}</updated>` +
    `<link rel="self" type="application/atom+xml" href="${esc(selfLink)}"/>` +
    `<link rel="alternate" type="text/html" href="${esc(blogLink)}"/>` +
    author +
    entries +
    `</feed>`;

  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
