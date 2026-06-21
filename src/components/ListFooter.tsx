import {
  CloseButton,
  Container,
  createListCollection,
  For,
  HStack,
  Input,
  InputGroup,
  Portal,
  Select,
  SelectValueChangeDetails,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChangeEvent, useCallback, useState } from "react";
import { FaGitAlt, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { MdOutlineLabel } from "react-icons/md";
import { useDebounce, useKeyPressEvent } from "react-use";
import useFocus from "@/hooks/useFocus";
import { isListViewBy, useGeneralSettings } from "@/hooks/useGeneralSettings";
import { alpha } from "@/utils/alpha";
import { useColorModeValue } from "./ui/color-mode";

const groupBy = createListCollection({
  items: [
    { label: "Recently created", value: "recent", icon: <FaRegCalendarAlt /> },
    { label: "Repo", value: "repo", icon: <FaGitAlt /> },
    { label: "Label", value: "label", icon: <MdOutlineLabel /> },
    { label: "User", value: "user", icon: <FaUser /> },
  ],
});

interface ListFooterProps {
  onSearch: (value: string) => void;
}

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

  const handleSelectValueChange = useCallback(
    (details: SelectValueChangeDetails) => {
      if (isListViewBy(details.value[0])) {
        void updateSettings({ ...settings, listViewBy: details.value[0] });
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

        <Select.Root
          colorPalette="blue"
          variant="outline"
          size="sm"
          value={[settings?.listViewBy ?? "recent"]}
          collection={groupBy}
          onValueChange={handleSelectValueChange}
          flexDirection="row"
          alignItems="baseline"
        >
          <Select.Label width="70px">Group by:</Select.Label>
          <Select.HiddenSelect />
          <Select.Control width="180px" background="bg.muted">
            <Select.Trigger>
              <Select.ValueText placeholder="group by..." />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <For each={groupBy.items}>
                  {(item) => (
                    <Select.Item item={item} key={item.value}>
                      <HStack>
                        {item.icon}
                        {item.label}
                      </HStack>
                      <Select.ItemIndicator />
                    </Select.Item>
                  )}
                </For>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>
    </Container>
  );
}
