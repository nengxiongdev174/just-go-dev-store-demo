import { lo } from "./lo";
import { th } from "./th";
import { en } from "./en";
import { type Locale, type StoreDictionary } from "./types";

export const dictionaries: Record<Locale, StoreDictionary> = {
  lo,
  th,
  en,
};

export * from "./types";

