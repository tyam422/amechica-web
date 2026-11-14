import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const groupName = z.enum([
    "渡米前",
    "到着後すぐ（最初の1か月）",
    "医療",
    "車・運転",
    "住まい・家のメンテナンス",
    "子ども・学校",
    "買い物・日常生活",
    "冬の生活・悪天候",
    "役所・税金",
]);

const topics = defineCollection({
  loader: glob({ base: "./src/content/topics", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: groupName,
    order: z.number().int(),
    youtubeId: z.string().optional(),
    youtubeUploadDate: z.string().optional(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// 紹介（places）: one store / restaurant / outing per page. Facts only.
// draft: true entries are shown only in `npm run dev`, never in the production build.
const places = defineCollection({
  loader: glob({ base: "./src/content/places", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    nameJa: z.string().default(""),
    category: z.string().default(""),
    city: z.string().default(""),
    address: z.string().default(""),
    hours: z.string().default(""),
    parking: z.string().default(""),
    payment: z.string().default(""),
    website: z.string().default(""),
    youtubeId: z.string().optional(),
    youtubeUploadDate: z.string().optional(),
    order: z.number().int(),
    updated: z.coerce.date(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { topics, places };
