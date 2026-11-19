import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { BLOG_DESCRIPTION, BLOG_TITLE, blogPath, isBlogPublished, sortBlogPosts } from "../../lib/blog";

// Blog-only RSS feed (for にほんブログ村 and feed readers). Newest first.
export async function GET(context: APIContext) {
  const posts = sortBlogPosts((await getCollection("blog")).filter((post) => isBlogPublished(post)));
  return rss({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    site: new URL("/blog/", context.site ?? "https://amechica.com").href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: blogPath(post.id),
    })),
    customData: "<language>ja</language>",
  });
}
