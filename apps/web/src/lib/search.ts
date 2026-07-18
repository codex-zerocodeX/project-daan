import type { PlaceNode } from "./type";

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .trim();
}

export function searchNode(query: string, node: PlaceNode[], limit = 5) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];

  return node
    .map((item) => {
      const name = normalizeSearch(item.name);
      const alias = item.alias.map(normalizeSearch);
      let rank = Number.POSITIVE_INFINITY;
      if (name === normalized) rank = 0;
      else if (name.startsWith(normalized)) rank = 1;
      else if (alias.some((value) => value.startsWith(normalized))) rank = 2;
      else if (name.includes(normalized)) rank = 3;
      else if (alias.some((value) => value.includes(normalized))) rank = 4;
      return { item, rank };
    })
    .filter((entry) => Number.isFinite(entry.rank))
    .sort((left, right) => left.rank - right.rank || left.item.name.localeCompare(right.item.name))
    .slice(0, limit)
    .map((entry) => entry.item);
}
