import { Chart, useChart } from "@chakra-ui/charts";
import { Heading, Text, Card } from "@chakra-ui/react";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PullRequest } from "../../utils/types";

interface DraftVsReadyChartProps {
  pullRequests: PullRequest[];
}

export function DraftVsReadyChart({ pullRequests }: DraftVsReadyChartProps) {
  const data = useMemo(() => {
    let draftCount = 0;
    let readyCount = 0;

    pullRequests.forEach((pr) => {
      if (pr.draft) {
        draftCount++;
      } else {
        readyCount++;
      }
    });

    return [
      { name: "Draft", value: draftCount, color: "gray.solid" },
      { name: "Ready", value: readyCount, color: "green.solid" },
    ].filter((d) => d.value > 0);
  }, [pullRequests]);

  const chart = useChart({
    data,
    series: [{ name: "value", label: "PRs" }],
  });

  if (pullRequests.length === 0) {
    return (
      <Card.Root variant="elevated">
        <Card.Header>
          <Heading size="md">Draft vs. Ready</Heading>
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
        <Heading size="md">Draft vs. Ready</Heading>
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
              innerRadius={60}
              outerRadius={80}
              label
            >
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chart.color(entry.color)} />
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
