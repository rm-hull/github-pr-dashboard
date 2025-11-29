import { Chart, useChart } from "@chakra-ui/charts";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { PullRequest } from "../../utils/types";
import { ChartPanel } from "./ChartPanel";

interface PrsByRepoChartProps {
  pullRequests: PullRequest[];
  title?: string;
}

const COLOR_TOKENS = [
  "purple.400",
  "blue.400",
  "teal.400",
  "green.400",
  "yellow.400",
  "orange.400",
  "red.400",
  "pink.400",
];

export function mergeBottomX<T extends { value: number }>(data: T[], x: number, otherLabel = "Other") {
  if (!data.length) return [];

  // 1. Sort ascending (smallest → biggest)
  const sorted = [...data].sort((a, b) => a.value - b.value);

  // 2. Compute total and threshold cutoff
  const total = sorted.reduce((sum, d) => sum + d.value, 0);
  const threshold = (total * x) / 100;

  // 3. Accumulate smallest values until they exceed the 25% threshold
  let cumulative = 0;
  const smallItems: T[] = [];
  const largeItems: T[] = [];

  for (const item of sorted) {
    if (cumulative + item.value <= threshold) {
      cumulative += item.value;
      smallItems.push(item);
    } else {
      largeItems.push(item);
    }
  }

  // 4. Combine the “bottom X%”
  const otherValue = smallItems.reduce((sum, d) => sum + d.value, 0);
  return otherValue > 0 ? [...largeItems, { name: otherLabel, value: otherValue } as unknown as T] : data;
}

export function PrsByRepoChart({ pullRequests, title = "Open PRs by Repository" }: PrsByRepoChartProps) {
  const data = useMemo(() => {
    const repoCounts: Record<string, number> = {};
    pullRequests.forEach((pr) => {
      const repoName = pr.repository_url.split("/").pop() || "unknown";
      repoCounts[repoName] = (repoCounts[repoName] || 0) + 1;
    });

    const data = Object.entries(repoCounts)
      .map(([name, value]) => ({ name, value }))
      .sort(({ value: a }, { value: b }) => b - a);

    return mergeBottomX(data, 25);
  }, [pullRequests]);

  const chart = useChart({ data });

  return (
    <ChartPanel title={title} noData={pullRequests.length === 0}>
      <Chart.Root chart={chart} height="300px">
        <PieChart>
          <Pie data={chart.data} dataKey={chart.key("value")} nameKey="name" cx="50%" cy="50%">
            {chart.data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={chart.color(COLOR_TOKENS[index % COLOR_TOKENS.length]) as string} />
            ))}
          </Pie>
          <Tooltip content={<Chart.Tooltip />} />
        </PieChart>
      </Chart.Root>
    </ChartPanel>
  );
}
