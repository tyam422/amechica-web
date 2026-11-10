import type { CollectionEntry } from "astro:content";

export const GROUPS = [
  {
    name: "渡米前",
    slug: "before-move",
    description: "日本を出る前に済ませておくと、到着後の混乱をかなり減らせます。",
    order: 1,
  },
  {
    name: "到着後すぐ（最初の1か月）",
    slug: "first-month",
    description: "生活の土台になる手続きです。後回しにすると、銀行・免許・病院・学校のすべてが止まります。",
    order: 2,
  },
  {
    name: "医療",
    slug: "health",
    description: "日本では体調を崩してから病院の窓口へ行けますが、米国では「かかる前にかかりつけを決める」が基本です。",
    order: 3,
  },
  {
    name: "車・運転",
    slug: "driving",
    description: "郊外生活では車が前提に近く、免許・保険・車の確保が並行して必要です。",
    order: 4,
  },
  {
    name: "住まい・家のメンテナンス",
    slug: "home",
    description: "米国、とくにシカゴ郊外の一戸建ては地下室があり、日本の住宅ではなじみのない設備や近隣ルールが出てきます。",
    order: 5,
  },
  {
    name: "子ども・学校",
    slug: "school",
    description: "転勤で子どもを連れて来る家庭向けです。学校の仕組み自体が、日本の「近くの公立に通う」とは違います。",
    order: 6,
  },
  {
    name: "買い物・日常生活",
    slug: "daily-life",
    description: "「まず何を、どこで、どう払うか」がわからない人向けの、日々の基礎です。",
    order: 7,
  },
  {
    name: "冬の生活・悪天候",
    slug: "winter",
    description: "シカゴ郊外は冬が長く、雪と寒さへの備えが生活の一部になります。トルネードは冬以外の季節の話も含め、天候の備えとしてここに置きます。",
    order: 8,
  },
  {
    name: "役所・税金",
    slug: "taxes",
    description: "勤務先の給与、持ち家、毎年の申告など、「会社が全部やってくれる」と思っていると漏れやすい話です。",
    order: 9,
  }
] as const;

export type GroupName = (typeof GROUPS)[number]["name"];
export type GroupSlug = (typeof GROUPS)[number]["slug"];
export type TopicEntry = CollectionEntry<"topics">;

const byName = new Map(GROUPS.map((group) => [group.name, group]));
const bySlug = new Map(GROUPS.map((group) => [group.slug, group]));

export function getGroupByName(name: string) {
  return byName.get(name as GroupName);
}

export function getGroupBySlug(slug: string) {
  return bySlug.get(slug as GroupSlug);
}

export function groupPath(slug: GroupSlug | string) {
  return `/groups/${slug}/`;
}

export function topicPath(id: string) {
  return `/topics/${id}/`;
}

export function isPublished(topic: TopicEntry, prod = import.meta.env.PROD) {
  return prod ? topic.data.draft !== true : true;
}

export function sortTopics(topics: TopicEntry[]) {
  return [...topics].sort((a, b) => a.data.order - b.data.order);
}

export function topicsInGroup(topics: TopicEntry[], name: GroupName) {
  return sortTopics(topics.filter((topic) => topic.data.group === name));
}

export function formatDate(date: Date) {
  // Frontmatter dates are calendar days (YYYY-MM-DD), parsed as UTC midnight.
  // Format in UTC so the printed day matches the file, not a shifted local day.
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
