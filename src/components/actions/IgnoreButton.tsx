import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { Button, Menu, MenuSelectionDetails, Portal } from "@chakra-ui/react";
import { useCallback } from "react";

interface IgnoreButtonProps {
  url: string;
}

const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

export function IgnoreButton({ url }: IgnoreButtonProps) {
  const { settings, updateSettings } = useGeneralSettings();
  const now = Date.now();

  const handleSelect = useCallback(
    (details: MenuSelectionDetails) => {
      updateSettings({
        ...settings,
        ignores: {
          ...settings?.ignores,
          [url]: parseInt(details.value),
        },
      });
    },
    [settings, updateSettings]
  );

  return (
    <Menu.Root onSelect={handleSelect}>
      <Menu.Trigger asChild>
        <Button>Ignore...</Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value={Number.MAX_SAFE_INTEGER.toFixed(0)}>Indefinitely</Menu.Item>
            <Menu.Item value={(now + ONE_DAY_IN_MILLIS).toFixed(0)}>24 Hours</Menu.Item>
            <Menu.Item value={(now + 7 * ONE_DAY_IN_MILLIS).toFixed(0)}>7 Days</Menu.Item>
            <Menu.Item value={(now + 28 * ONE_DAY_IN_MILLIS).toFixed(0)}>4 Weeks</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
