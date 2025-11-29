import { Chart, useChart } from "@chakra-ui/charts";
import { Heading, Text, Card } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";

interface MergedPrsOverTimeChartProps {
  pullRequests: PullRequest[];
}

export function MergedPrsOverTimeChart({ pullRequests }: MergedPrsOverTimeChartProps) {
  const data = useMemo(() => {
    const countsByDay: Record<string, number> = {};

    pullRequests.forEach((pr) => {
      // Search API items don't have merged_at, but since we filter by is:merged, closed_at is the merge time.
      if (!pr.closed_at) return;
      const mergedDate = parseISO(pr.closed_at);
      const key = format(mergedDate, "yyyy-MM-dd");
      countsByDay[key] = (countsByDay[key] || 0) + 1;
    });

    // Sort by date
    return Object.entries(countsByDay)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, value]) => ({ name: format(parseISO(date), "MMM d"), count: value }));
  }, [pullRequests]);

  const chart = useChart({
    data,
    series: [{ name: "count", label: "Merged PRs", color: "green.solid" }],
  });

  if (pullRequests.length === 0) {
    return (
      <Card.Root variant="elevated">
        <Card.Header>
          <Heading size="md">Merged PRs Over Time</Heading>
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
        <Heading size="md">Merged PRs Over Time (Daily)</Heading>
      </Card.Header>
      <Card.Body>
        <Chart.Root chart={chart} height="300px">
          <BarChart data={chart.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<Chart.Tooltip />} />
            <Legend content={<Chart.Legend />} />
            <Bar dataKey={chart.key("count")} fill={chart.color("green.solid") as string} name="Merged PRs" />
          </BarChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
}
