import { Chart, useChart } from "@chakra-ui/charts";
import { differenceInHours, parseISO } from "date-fns";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";
import { ChartPanel } from "./ChartPanel";

interface MergeTimeDistributionChartProps {
  pullRequests: PullRequest[];
}

export function MergeTimeDistributionChart({ pullRequests }: MergeTimeDistributionChartProps) {
  const data = useMemo(() => {
    const buckets = {
      "< 2 hrs": 0,
      "2-4 hrs": 0,
      "4-8 hrs": 0,
      "< 1 day": 0,
      "1-3 days": 0,
      "3-7 days": 0,
      "> 1 week": 0,
    };

    pullRequests.forEach((pr) => {
      // Search API items don't have merged_at, but since we filter by is:merged, closed_at is the merge time.
      if (!pr.closed_at) return;
      const created = parseISO(pr.created_at);
      const merged = parseISO(pr.closed_at);
      const diffHours = differenceInHours(merged, created);
      const diffDays = diffHours / 24;

      if (diffHours < 2) {
        buckets["< 2 hrs"]++;
      } else if (diffHours < 4) {
        buckets["2-4 hrs"]++;
      } else if (diffHours < 8) {
        buckets["4-8 hrs"]++;
      } else if (diffDays < 1) {
        buckets["< 1 day"]++;
      } else if (diffDays <= 3) {
        buckets["1-3 days"]++;
      } else if (diffDays <= 7) {
        buckets["3-7 days"]++;
      } else {
        buckets["> 1 week"]++;
      }
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, count: value }));
  }, [pullRequests]);

  const chart = useChart({
    data,
    series: [{ name: "count", label: "Number of PRs", color: "blue.400" }],
  });

  return (
    <ChartPanel title="Merge Time Distribution" noData={pullRequests.length === 0}>
      <Chart.Root chart={chart} height="300px">
        <BarChart data={chart.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<Chart.Tooltip />} />
          <Legend content={<Chart.Legend />} />
          <Bar dataKey={chart.key("count")} fill={chart.color("blue.400") as string} name="Number of PRs" />
        </BarChart>
      </Chart.Root>
    </ChartPanel>
  );
}
