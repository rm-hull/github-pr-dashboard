import { Card, Heading, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type ChartPanelProps = {
  title: string;
  noData: boolean;
  height?: string;
};

export function ChartPanel({ title, noData, children, height = "300px" }: PropsWithChildren<ChartPanelProps>) {
  if (noData) {
    return (
      <Card.Root variant="elevated" height="100%">
        <Card.Header>
          <Heading>{title}</Heading>
        </Card.Header>
        <Card.Body>
          <Text height={height} color="gray.500">
            No data available
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="elevated" height="100%">
      <Card.Header>
        <Heading>{title}</Heading>
      </Card.Header>
      <Card.Body px={0}>{children}</Card.Body>
    </Card.Root>
  );
}
