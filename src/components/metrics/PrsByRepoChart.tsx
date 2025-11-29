import { Chart, useChart } from "@chakra-ui/charts";
import { Heading, Text, Card } from "@chakra-ui/react";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";

interface PrsByRepoChartProps {
  pullRequests: PullRequest[];
  title?: string;
}

const COLOR_TOKENS = ["blue.solid", "green.solid", "yellow.solid", "orange.solid", "purple.solid", "teal.solid"];

const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

export function PrsByRepoChart({ pullRequests, title = "Open PRs by Repository" }: PrsByRepoChartProps) {
  const data = useMemo(() => {
    const repoCounts: Record<string, number> = {};
    pullRequests.forEach((pr) => {
      // repository_url: "https://api.github.com/repos/owner/repo"
      const repoName = pr.repository_url.split("/").pop() || "unknown";
      repoCounts[repoName] = (repoCounts[repoName] || 0) + 1;
    });

    return Object.entries(repoCounts)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLOR_TOKENS[index % COLOR_TOKENS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [pullRequests]);

  const chart = useChart({
    data,
    series: [{ name: "value", label: "PRs" }],
  });

  if (pullRequests.length === 0) {
    return (
      <Card.Root variant="elevated">
        <Card.Header>
          <Heading size="md">{title}</Heading>
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
        <Heading size="md">{title}</Heading>
      </Card.Header>
      <Card.Body>
        <Chart.Root chart={chart} height="300px">
          <PieChart>
            <Pie
              data={chart.data}
              dataKey={chart.key("value")}
              nameKey="name"
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              label={renderLabel}
            >
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chart.color(entry.color) as string} />
              ))}
            </Pie>
            <Tooltip content={<Chart.Tooltip />} />
            <Legend content={<Chart.Legend />} />
          </PieChart>
        </Chart.Root>
      </Card.Body>
    </Card.Root>
  );
}
