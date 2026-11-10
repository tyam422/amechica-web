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
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { topics };
