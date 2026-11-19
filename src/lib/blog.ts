import type { CollectionEntry } from "astro:content";
import { SHOW_DRAFTS } from "./drafts";

export type BlogEntry = CollectionEntry<"blog">;

export const BLOG_TITLE = "amechica ブログ";
export const BLOG_DESCRIPTION =
  "シカゴ郊外で暮らす管理人の体験談です。調べて確かめた情報と、渡米ガイドの記事へのリンクを添えています。";
export const BLOG_RSS_PATH = "/blog/rss.xml";

export function isBlogPublished(post: BlogEntry, prod = !SHOW_DRAFTS) {
  return prod ? post.data.draft !== true : true;
}

export function blogPath(id: string) {
  return `/blog/${id}/`;
}

/** Newest first by publish date. */
export function sortBlogPosts(posts: BlogEntry[]) {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Last change date: `updated` if set, otherwise the publish date. */
export function lastModified(post: BlogEntry) {
  return post.data.updated ?? post.data.pubDate;
}
