// Drafts (draft: true topics/places, the unfinished 紹介 section) are shown in
// `npm run dev`, and in a local preview build made with PREVIEW_DRAFTS=1.
// A normal `npm run build` (production) never includes them.
export const SHOW_DRAFTS: boolean =
  import.meta.env.DEV || (typeof process !== "undefined" && process.env.PREVIEW_DRAFTS === "1");
