import { Chart, useChart } from "@chakra-ui/charts";
import { Heading, Text, Card } from "@chakra-ui/react";
import { differenceInHours, parseISO } from "date-fns";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";

interface MergeTimeDistributionChartProps {
  pullRequests: PullRequest[];
}

export function MergeTimeDistributionChart({ pullRequests }: MergeTimeDistributionChartProps) {
  const data = useMemo(() => {
    const buckets = {
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

      if (diffDays < 1) {
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
    series: [{ name: "count", label: "Number of PRs", color: "blue.solid" }],
  });

  if (pullRequests.length === 0) {
    return (
      <Card.Root variant="elevated">
        <Card.Header>
          <Heading size="md">Merge Time Distribution</Heading>
        </Card.Header>
        <Card.Body>
          <Text color="gray.500">No data available</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="elevated" height="100%">
      <Card.Header>
        <Heading size="md">Merge Time Distribution</Heading>
      </Card.Header>
      <Card.Body>
        <Chart.Root chart={chart} height="300px">
          <BarChart data={chart.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<Chart.Tooltip />} />
            <Legend content={<Chart.Legend />} />
            <Bar dataKey={chart.key("count")} fill={chart.color("blue.solid") as string} name="Number of PRs" />
          </BarChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
}
