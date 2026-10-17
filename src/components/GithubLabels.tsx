import { HStack, Badge } from "@chakra-ui/react";
import { getContrastTextColor, getRelativeLuminance } from "@/utils/luminance";
import { useColorMode } from "./ui/color-mode";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <HStack gap={1} flexWrap="wrap">
      {labels.map((label) => {
        const textColor = label.color ? getContrastTextColor(label.color, isDark) : "fg";
        const labelLuminance = label.color ? getRelativeLuminance(label.color) : 0;
        const needsBorder = isDark ? labelLuminance < 0.6 : labelLuminance > 0.4;

        return (
          <Badge
            key={label.id ?? label.name}
            bg={label.color ? `#${label.color}${isDark ? "66" : "33"}` : "bg.muted"}
            color={textColor}
            fontSize="xs"
            border={needsBorder ? `0.75px solid ${textColor}33` : undefined}
          >
            {label.name}
          </Badge>
        );
      })}
    </HStack>
  );
}
