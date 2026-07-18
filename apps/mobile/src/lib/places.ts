/**
 * A tiny, hardcoded gazetteer of Metro Manila transit landmarks.
 *
 * The UI works in place names ("Ortigas Center") but the API works in
 * coordinates, so this module is the translation layer between the two.
 * There is deliberately no geocoding service: every coordinate below is
 * hand-checked and matches the seeded database. A missing place is far
 * better than a wrong one, because a wrong coordinate silently produces a
 * wrong route - so do not guess when adding entries.
 */

export type Place = { name: string; lat: number; lng: number };

/** A gazetteer row: a place plus the free-text spellings that should find it. */
type GazetteerEntry = Place & { aliases: string[] };

const GAZETTEER: readonly GazetteerEntry[] = [
  // --- Katipunan / LRT-2 east ---
  {
    name: "Ateneo Gate 3, Katipunan",
    lat: 14.6397,
    lng: 121.0772,
    aliases: ["ateneo", "ateneo de manila", "admu", "ateneo gate 3", "gate 3"],
  },
  {
    name: "Katipunan LRT-2 Station",
    lat: 14.6301,
    lng: 121.0733,
    aliases: ["katipunan", "katipunan station", "katipunan lrt"],
  },
  {
    name: "Santolan LRT-2",
    lat: 14.622,
    lng: 121.085,
    aliases: ["santolan lrt", "santolan station"],
  },
  {
    name: "Marikina-Pasig LRT-2",
    lat: 14.6247,
    lng: 121.0983,
    aliases: ["marikina", "pasig", "marikina pasig", "marikina station"],
  },
  {
    name: "Antipolo LRT-2",
    lat: 14.6248,
    lng: 121.1237,
    aliases: ["antipolo", "antipolo station", "antipolo lrt"],
  },

  // --- Cubao interchange ---
  {
    name: "Araneta Center-Cubao LRT-2",
    lat: 14.6227,
    lng: 121.053,
    aliases: [
      "araneta",
      "araneta center",
      "araneta coliseum",
      "cubao lrt",
      "gateway mall",
    ],
  },
  {
    name: "Cubao MRT-3 Station",
    lat: 14.6197,
    lng: 121.051,
    aliases: ["cubao", "cubao mrt", "edsa cubao"],
  },

  // --- MRT-3 / EDSA, north to south ---
  {
    name: "SM North EDSA",
    lat: 14.6564,
    lng: 121.03,
    aliases: ["sm north", "sm north edsa", "trinoma", "north edsa"],
  },
  {
    name: "North Avenue MRT-3",
    lat: 14.6524,
    lng: 121.0334,
    aliases: ["north avenue", "north ave", "north avenue mrt"],
  },
  {
    name: "Quezon Avenue MRT-3",
    lat: 14.6427,
    lng: 121.0388,
    aliases: ["quezon avenue", "quezon ave", "quezon avenue mrt"],
  },
  {
    name: "Kamuning MRT-3",
    lat: 14.635,
    lng: 121.043,
    aliases: ["kamuning", "gma kamuning", "kamuning mrt"],
  },
  {
    name: "Santolan-Annapolis MRT-3",
    lat: 14.6069,
    lng: 121.0565,
    aliases: ["annapolis", "santolan annapolis", "greenhills"],
  },
  {
    name: "Ortigas MRT-3 Station",
    lat: 14.5875,
    lng: 121.0565,
    aliases: ["ortigas", "ortigas center", "ortigas mrt", "edsa ortigas"],
  },
  {
    name: "Ayala MRT-3 Station",
    lat: 14.5486,
    lng: 121.0281,
    aliases: ["ayala", "makati", "ayala mrt", "edsa ayala", "ayala center"],
  },
  {
    name: "Ayala Avenue, Makati",
    lat: 14.556,
    lng: 121.027,
    aliases: [
      "ayala avenue",
      "ayala ave",
      "makati cbd",
      "makati central business district",
    ],
  },
  {
    name: "Taft Avenue MRT-3 / EDSA",
    lat: 14.5378,
    lng: 121.0014,
    aliases: ["taft", "taft avenue", "taft ave", "edsa taft", "taft mrt"],
  },

  // --- Bay area ---
  {
    name: "Roxas Boulevard",
    lat: 14.536,
    lng: 120.997,
    aliases: ["roxas", "roxas boulevard", "roxas blvd"],
  },
  {
    name: "SM Mall of Asia",
    lat: 14.535,
    lng: 120.982,
    aliases: ["moa", "mall of asia", "sm moa", "sm mall of asia"],
  },
];

/**
 * Fold a query or place name into a comparable form: lowercase, accent-free,
 * punctuation-free, single-spaced. "Araneta Center-Cubao LRT-2" and
 * "  araneta center cubao lrt 2  " both become "araneta center cubao lrt 2".
 */
/** Unicode combining marks, so "Muñoz" folds to "munoz". */
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type IndexedPlace = {
  place: Place;
  /** Normalized canonical name. */
  name: string;
  /** Normalized aliases. */
  aliases: string[];
};

const INDEX: IndexedPlace[] = GAZETTEER.map((entry) => ({
  place: { name: entry.name, lat: entry.lat, lng: entry.lng },
  name: normalize(entry.name),
  aliases: entry.aliases.map(normalize),
}));

/** Every known place, in gazetteer order. */
export const PLACES: Place[] = INDEX.map((entry) => entry.place);

/**
 * Match tiers, best first. Lower wins; ties are broken by gazetteer order so
 * results are fully deterministic.
 */
const TIER_NAME_EXACT = 0;
const TIER_ALIAS_EXACT = 1;
const TIER_NAME_PREFIX = 2;
const TIER_ALIAS_PREFIX = 3;
const TIER_NAME_SUBSTRING = 4;
const TIER_ALIAS_SUBSTRING = 5;
const TIER_NONE = Number.POSITIVE_INFINITY;

/** Best (lowest) tier at which `entry` matches the normalized query. */
function matchTier(entry: IndexedPlace, query: string): number {
  if (entry.name === query) return TIER_NAME_EXACT;
  if (entry.aliases.includes(query)) return TIER_ALIAS_EXACT;
  if (entry.name.startsWith(query)) return TIER_NAME_PREFIX;
  if (entry.aliases.some((alias) => alias.startsWith(query))) {
    return TIER_ALIAS_PREFIX;
  }
  if (entry.name.includes(query)) return TIER_NAME_SUBSTRING;
  if (entry.aliases.some((alias) => alias.includes(query))) {
    return TIER_ALIAS_SUBSTRING;
  }
  return TIER_NONE;
}

/** Ranked matches for autocomplete/suggestions. */
export function searchPlaces(query: string, limit = 8): Place[] {
  const normalized = normalize(query);
  if (normalized === "" || limit <= 0) return [];

  const matches: { tier: number; order: number; place: Place }[] = [];
  INDEX.forEach((entry, order) => {
    const tier = matchTier(entry, normalized);
    if (tier !== TIER_NONE) matches.push({ tier, order, place: entry.place });
  });

  matches.sort((a, b) => a.tier - b.tier || a.order - b.order);
  return matches.slice(0, limit).map((match) => match.place);
}

/** Best single match for a free-text query, or null if nothing matches. */
export function resolvePlace(query: string): Place | null {
  const [best] = searchPlaces(query, 1);
  return best ?? null;
}
