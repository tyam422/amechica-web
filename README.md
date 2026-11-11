# amechica-web

Japanese-language static site for [amechica.com](https://amechica.com) (アメリカ生活シカゴ郊外). It is a guide for Japanese people moving to the U.S., mostly for a work transfer (転勤), with Chicago-suburb specifics. Content lives in Markdown. There is no database.

Each topic page can later link to a YouTube video. Videos are not loaded until the visitor clicks a thumbnail.

## Requirements

- Node.js 22 or later
- npm

## Run locally

```bash
cd amechica-web
npm install
npm run dev
```

The dev server listens on [http://localhost:4321](http://localhost:4321). Port 4321 is set in `package.json` and `astro.config.mjs` so it does not collide with other local sites (for example a app on port 3000).

To preview the production build:

```bash
npm run build
npm run preview
```

`npm run preview` also uses port 4321.

## Project layout

- `src/content/topics/` — one Markdown file per topic (Astro content collection)
- `src/content.config.ts` — collection schema
- `src/lib/groups.ts` — group names, slugs, and short descriptions
- `src/pages/` — routes (home, about, privacy, contact, 404, one page per group, one page per topic)
- `public/robots.txt` and `public/favicon.svg`
- `.env.example` — optional `PUBLIC_GA_ID` for Google Analytics 4; copy to `.env` locally and leave unset unless you have a measurement ID. Do not commit a real ID. The gtag snippet is rendered only when the variable is set.

## Add a topic

1. Add a Markdown file in `src/content/topics/`. The filename (without `.md`) becomes the URL slug, for example `src/content/topics/park-district.md` is served at `/topics/park-district/`.
2. Fill in the frontmatter:

   ```md
   ---
   title: "公園区（park district）の習い事"
   description: "One-sentence summary used for SEO and listings."
   group: "子ども・学校"
   order: 5
   updated: 2026-11-20
   draft: false
   youtubeId: "xxxxxxxxxxx"
   ---
   ```

   - `title` (required): Japanese page title
   - `description` (required): short summary
   - `group` (required): must be one of the group names in `src/lib/groups.ts`
   - `order` (required): integer sort order within that group
   - `updated` (required): last-updated date (`YYYY-MM-DD`)
   - `draft` (required): set `true` to hide the topic from production listings and routes; it still appears in `npm run dev`
   - `youtubeId` (optional): the 11-character YouTube video id only, not a full URL. If it is omitted, the topic page shows a “動画は準備中です” note.
3. Write the article body in Japanese. Do not invent deadlines, fees, phone numbers, or legal requirements; check official sources when you draft the real article.
4. If you need a new group, add it to `GROUPS` in `src/lib/groups.ts` first (name, slug, description, order), then use that exact `group` name in the Markdown file.
5. Run `npm run dev` and open the topic and group pages to check the listing and the video embed.

## Build for a Render static site

Build command:

```bash
npm run build
```

Publish directory (output dir):

```text
dist
```

Render should use a static site (or static site on a Node service that only runs the build). Set the Node version to 22 if the dashboard asks for one. This repo does not need a database or a long-running server process after the build.

The build also writes a sitemap (`sitemap-index.xml`) for `https://amechica.com` and copies `robots.txt` from `public/`.

## Stack

- [Astro](https://astro.build) (static output)
- `@astrojs/sitemap`
- Markdown content collections
