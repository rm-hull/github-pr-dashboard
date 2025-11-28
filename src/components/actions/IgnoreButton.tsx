import { Button, Menu, MenuSelectionDetails, Portal } from "@chakra-ui/react";
import { useCallback } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";

interface IgnoreButtonProps {
  url: string;
  disabled?: boolean;
}

const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

export function IgnoreButton({ url, disabled = false }: IgnoreButtonProps) {
  const { settings, updateSettings } = useGeneralSettings();

  const handleSelect = useCallback(
    (details: MenuSelectionDetails) => {
      const now = Date.now();
      const value = details.value;

      let ignoreUntil;
      if (value === "INDEFINITELY") {
        ignoreUntil = Number.MAX_SAFE_INTEGER;
      } else {
        ignoreUntil = now + parseInt(value, 10);
      }

      void updateSettings({
        ...settings,
        ignored: {
          ...settings?.ignored,
          prs: {
            ...settings?.ignored?.prs,
            [url]: ignoreUntil,
          },
        },
      });
    },
    [settings, updateSettings, url]
  );

  return (
    <Menu.Root onSelect={handleSelect}>
      <Menu.Trigger asChild>
        <Button disabled={disabled}>Ignore...</Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="INDEFINITELY">Indefinitely</Menu.Item>
            <Menu.Item value={String(ONE_DAY_IN_MILLIS)}>24 Hours</Menu.Item>
            <Menu.Item value={String(7 * ONE_DAY_IN_MILLIS)}>7 Days</Menu.Item>
            <Menu.Item value={String(28 * ONE_DAY_IN_MILLIS)}>4 Weeks</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
