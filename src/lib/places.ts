import type { CollectionEntry } from "astro:content";
import { SHOW_DRAFTS } from "./drafts";

export type PlaceEntry = CollectionEntry<"places">;

// The places section is public (Teppei approved publishing on 2026-11-14).
// Individual places still stay hidden in production while they have draft: true.
export const PLACES_ENABLED = true;

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
