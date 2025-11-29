import { Chart, useChart } from "@chakra-ui/charts";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";
import { ChartPanel } from "./ChartPanel";

type ByType = "day" | "week" | "month";

interface MergedPrsOverTimeChartProps {
  pullRequests: PullRequest[];
  by: "day" | "week" | "month";
}

const grouper: Record<ByType, string> = {
  day: "yyyy-MM-dd",
  week: "yyyy-II",
  month: "yyyy-MM",
};

export function MergedPrsOverTimeChart({ pullRequests, by }: MergedPrsOverTimeChartProps) {
  const data = useMemo(() => {
    const countsByBucket: Record<string, number> = {};

    pullRequests.forEach((pr) => {
      // Search API items don't have merged_at, but since we filter by is:merged, closed_at is the merge time.
      if (!pr.closed_at) return;
      const mergedDate = parseISO(pr.closed_at);
      const key = format(mergedDate, grouper[by]);
      countsByBucket[key] = (countsByBucket[key] || 0) + 1;
    });

    // Sort by date
    return Object.entries(countsByBucket)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, value]) => ({ name: by == "day" ? format(parseISO(date), "MMM d") : date.slice(5), count: value }));
  }, [pullRequests, by]);

  const chart = useChart({
    data,
    series: [{ name: "count", label: `Merged PRs by ${by}`, color: "green.400" }],
  });

  return (
    <ChartPanel title={`Merged PRs Over Time (by ${by})`} noData={pullRequests.length === 0}>
      <Chart.Root chart={chart} height="300px">
        <BarChart data={chart.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<Chart.Tooltip />} />
          <Legend content={<Chart.Legend />} />
          <Bar dataKey={chart.key("count")} fill={chart.color("green.400") as string} name="Merged PRs" />
        </BarChart>
      </Chart.Root>
    </ChartPanel>
  );
}
