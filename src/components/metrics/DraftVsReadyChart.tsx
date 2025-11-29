import { Chart, useChart } from "@chakra-ui/charts";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { PullRequest } from "../../utils/types";
import { ChartPanel } from "./ChartPanel";

interface DraftVsReadyChartProps {
  pullRequests: PullRequest[];
}

export function DraftVsReadyChart({ pullRequests }: DraftVsReadyChartProps) {
  const data = useMemo(() => {
    const { draftCount, readyCount } = pullRequests.reduce(
      (acc, pr) => {
        if (pr.draft) {
          acc.draftCount++;
        } else {
          acc.readyCount++;
        }
        return acc;
      },
      { draftCount: 0, readyCount: 0 },
    );

    return [
      { name: "Draft", value: draftCount, color: "gray.300" },
      { name: "Ready", value: readyCount, color: "green.400" },
    ].filter((d) => d.value > 0);
  }, [pullRequests]);

  const chart = useChart({ data });

  return (
    <ChartPanel title="Draft vs. Ready" noData={pullRequests.length === 0}>
      <Chart.Root chart={chart} height="300px">
        <PieChart>
          <Pie data={chart.data} dataKey={chart.key("value")} nameKey="name" cx="50%" cy="50%" innerRadius={60}>
            {chart.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chart.color(entry.color) as string} />
            ))}
          </Pie>
          <Tooltip content={<Chart.Tooltip />} />
        </PieChart>
      </Chart.Root>
    </ChartPanel>
  );
}
