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
import { isListViewBy, ListViewBy, useGeneralSettings } from "@/hooks/useGeneralSettings";
import { alpha } from "@/utils/alpha";
import { useColorModeValue } from "./ui/color-mode";

interface ListFooterProps {
  onSearch: (value: string) => void;
}

type RadioItem = {
  label: string;
  value: ListViewBy;
};

const items = [
  { label: "Recently created", value: "recent" },
  { label: "By repo", value: "repo" },
] as const satisfies ReadonlyArray<RadioItem>;

export function ListFooter({ onSearch }: ListFooterProps) {
  const [inputRef, setInputFocus] = useFocus();
  const { settings, updateSettings } = useGeneralSettings();
  const isStacked = useBreakpointValue({ base: true, md: false });
  const [searchText, setSearchText] = useState("");
  const bgColor = useColorModeValue(
    alpha("blue.50", 0.5), // light
    alpha("blue.800", 0.3) // dark
  );

  const borderColor = useColorModeValue("blue.100", "blue.900");

  const handleRadioValueChange = useCallback(
    (details: RadioGroupValueChangeDetails) => {
      if (isListViewBy(details.value)) {
        updateSettings({ ...settings, listViewBy: details.value });
      }
    },
    [settings, updateSettings]
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value.trim());
    },
    [setSearchText]
  );

  useDebounce(() => onSearch(searchText), 300, [searchText]);
  const clearSearch = useCallback(() => setSearchText(""), [setSearchText]);

  useKeyPressEvent("Escape", clearSearch);
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
            endElement={
              <CloseButton size="xs" variant="plain" onClick={clearSearch} disabled={searchText.length === 0} />
            }
          >
            <Input
              ref={inputRef}
              colorPalette="blue"
              background="bg.muted"
              size="sm"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </InputGroup>
        )}

        <RadioGroup.Root
          colorPalette="blue"
          variant="subtle"
          value={settings?.listViewBy ?? "recent"}
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
