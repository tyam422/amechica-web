import type { CollectionEntry } from "astro:content";
import { SHOW_DRAFTS } from "./drafts";

export type PlaceEntry = CollectionEntry<"places">;

// The places section is unfinished. Until it is ready, it exists only in dev:
// production builds get no /places/ pages, no sitemap entries, no nav link.
export const PLACES_ENABLED = SHOW_DRAFTS;

export function isPlacePublished(place: PlaceEntry, prod = !SHOW_DRAFTS) {
  return prod ? place.data.draft !== true : true;
}

export function placePath(id: string) {
  return `/places/${id}/`;
}

export function sortPlaces(places: PlaceEntry[]) {
  return [...places].sort((a, b) => a.data.order - b.data.order);
}

export function uniqueValues(places: PlaceEntry[], key: "category" | "city") {
  return [...new Set(places.map((p) => p.data[key]).filter((v) => v))].sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
}
