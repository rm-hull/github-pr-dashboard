export function groupBySelector<T>(items: T[], selector: (item: T) => string[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const keys = selector(item);
    for (const key of keys) {
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
    }
    return acc;
  }, {});
}
