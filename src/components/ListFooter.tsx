import {
  CloseButton,
  Container,
  HStack,
  Input,
  InputGroup,
  RadioGroup,
  RadioGroupValueChangeDetails,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChangeEvent, useCallback, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDebounce, useKeyPressEvent } from "react-use";
import useFocus from "@/hooks/useFocus";
import { alpha } from "@/utils/alpha";
import { useColorModeValue } from "./ui/color-mode";

interface ListFooterProps {
  onSelect: (value: string) => void;
  onSearch: (value: string) => void;
}

export function ListFooter({ onSelect, onSearch }: ListFooterProps) {
  const [inputRef, setInputFocus] = useFocus();
  const isStacked = useBreakpointValue({ base: true, md: false });
  const [value, setValue] = useState("");
  const bgColor = useColorModeValue(
    alpha("blue.50", 0.5), // light
    alpha("blue.800", 0.3) // dark
  );

  const borderColor = useColorModeValue("blue.100", "blue.900");

  const items = [
    { label: "Recently created", value: "recent" },
    { label: "By repo", value: "by-repo" },
  ];

  const handleRadioValueChange = useCallback(
    (details: RadioGroupValueChangeDetails) => {
      onSelect(details.value ?? "recent");
    },
    [onSelect]
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value.trim());
    },
    [setValue]
  );

  useDebounce(() => onSearch(value), 300, [value]);

  useKeyPressEvent("Escape", () => setValue(""));
  useKeyPressEvent("/", (event: KeyboardEvent) => {
    event.preventDefault();
    setTimeout(setInputFocus, 20);
  });

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
      <HStack width="full" gap={8}>
        {!isStacked && (
          <InputGroup
            width="300px"
            startElement={<LuSearch />}
            endElement={<CloseButton size="xs" variant="plain" onClick={() => setValue("")} />}
          >
            <Input
              ref={inputRef}
              colorPalette="blue"
              background="bg.muted"
              size="sm"
              placeholder="Search..."
              value={value}
              onChange={handleSearchChange}
            />
          </InputGroup>
        )}

        <RadioGroup.Root
          colorPalette="blue"
          variant="subtle"
          defaultValue="recent"
          onValueChange={handleRadioValueChange}
        >
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
      </HStack>
    </Container>
  );
}
