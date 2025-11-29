import { Chart, useChart } from "@chakra-ui/charts";
import { Heading, Text, Card } from "@chakra-ui/react";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";

interface PrAgeDistributionChartProps {
  pullRequests: PullRequest[];
}

export function PrAgeDistributionChart({ pullRequests }: PrAgeDistributionChartProps) {
  const data = useMemo(() => {
    const buckets = {
      "< 3 days": 0,
      "3-7 days": 0,
      "1-4 weeks": 0,
      "> 1 month": 0,
    };

    const now = new Date();

    pullRequests.forEach((pr) => {
      const created = new Date(pr.created_at);
      const diffDays = differenceInDays(now, created);

      if (diffDays < 3) {
        buckets["< 3 days"]++;
      } else if (diffDays <= 7) {
        buckets["3-7 days"]++;
      } else if (diffDays <= 28) {
        buckets["1-4 weeks"]++;
      } else {
        buckets["> 1 month"]++;
      }
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, count: value }));
  }, [pullRequests]);

  const chart = useChart({
    data,
    series: [{ name: "count", label: "Number of PRs", color: "purple.solid" }],
  });

  if (pullRequests.length === 0) {
    return (
      <Card.Root variant="elevated">
        <Card.Header>
          <Heading size="md">PR Age Distribution</Heading>
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
        <Heading size="md">PR Age Distribution</Heading>
      </Card.Header>
      <Card.Body>
        <Chart.Root chart={chart} height="300px">
          <BarChart data={chart.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<Chart.Tooltip />} />
            <Legend content={<Chart.Legend />} />
            <Bar dataKey={chart.key("count")} fill={chart.color("purple.solid")} name="Number of PRs" />
          </BarChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
}
