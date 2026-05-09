import { HStack, Badge } from "@chakra-ui/react";

type Label = {
  /** Format: int64 */
  id?: number;
  node_id?: string;
  url?: string;
  name?: string;
  color?: string;
  default?: boolean;
  description?: string | null;
};

type GithubLabelsProps = {
  labels: Label[];
};

export function GithubLabels({ labels }: GithubLabelsProps) {
  return (
    <HStack gap={1} flexWrap="wrap">
      {labels.map((label) => (
        <Badge
          key={label.id ?? label.name}
          bg={label.color ? `#${label.color}33` : "bg.muted"}
          color={label.color ? `#${label.color}` : "fg"}
          fontSize="xs"
        >
          {label.name}
        </Badge>
      ))}
    </HStack>
  );
}
