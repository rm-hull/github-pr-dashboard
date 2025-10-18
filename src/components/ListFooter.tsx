import { Container, HStack, RadioGroup, RadioGroupValueChangeDetails } from "@chakra-ui/react";
import { useCallback } from "react";
import { alpha } from "@/utils/alpha";
import { useColorModeValue } from "./ui/color-mode";

interface ListFooterProps {
  onSelect: (value: string) => void;
}

export function ListFooter({ onSelect }: ListFooterProps) {
  const bgColor = useColorModeValue(
    alpha("blue.50", 0.5), // light
    alpha("blue.800", 0.3) // dark
  );

  const borderColor = useColorModeValue("blue.100", "blue.900");

  const items = [
    { label: "Recently created", value: "recent" },
    { label: "By repo", value: "by-repo" },
  ];

  const handleValueChange = useCallback(
    (details: RadioGroupValueChangeDetails) => {
      onSelect(details.value ?? "recent");
    },
    [onSelect]
  );

  return (
    <Container
      py={2}
      maxW="full"
      position="fixed"
      left={0}
      bottom={0}
      bg={bgColor}
      backdropFilter="saturate(180%) blur(5px)"
      borderTop="1px solid"
      borderColor={borderColor}
      zIndex={100}
    >
      <RadioGroup.Root colorPalette="blue" variant="subtle" defaultValue="recent" onValueChange={handleValueChange}>
        <HStack gap="6">
          <RadioGroup.Label>Group by:</RadioGroup.Label>
          {items.map((item) => (
            <RadioGroup.Item key={item.value} value={item.value} cursor="pointer">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator cursor="pointer" />
              <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
            </RadioGroup.Item>
          ))}
        </HStack>
      </RadioGroup.Root>
    </Container>
  );
}
