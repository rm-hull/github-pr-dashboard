import { Badge, Button, Field, HStack, Switch, VStack } from "@chakra-ui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useCallback, useMemo } from "react";
import { IoWarning } from "react-icons/io5";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { RepoListbox } from "./RepoListbox";
import { DatePicker } from "../ui/date-picker";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();
  const isNotificationsSupported = "Notification" in window;

  const handleCutoffDateChange = useCallback(
    (details: { value: any[] }) => {
      const dt = details.value[0]?.toDate(getLocalTimeZone());
      void updateSettings({ ...(settings ?? {}), cutoffDate: dt?.getTime() });
    },
    [settings, updateSettings]
  );

  const handleClearCutoffDate = useCallback(
    () => void updateSettings({ ...(settings ?? {}), cutoffDate: undefined }),
    [settings, updateSettings]
  );

  const handleToggleEnableNotifications = useCallback(() => {
    void updateSettings({ ...(settings ?? {}), enableNotifications: !(settings?.enableNotifications ?? false) });
  }, [settings, updateSettings]);

  const handleIgnoredRepoChange = useCallback(
    (ignored: string[]) =>
      void updateSettings({ ...(settings ?? {}), ignored: { ...settings?.ignored, repos: ignored } }),
    [settings, updateSettings]
  );

  const cutoffDateValue = useMemo(() => {
    if (!settings?.cutoffDate) return [];
    try {
      return [parseDate(new Date(settings.cutoffDate).toISOString().split("T")[0])];
    } catch {
      return [];
    }
  }, [settings?.cutoffDate]);

  return (
    <VStack>
      <Field.Root>
        <HStack alignItems="start">
          <Field.Label width="100px" pt={2}>
            Cutoff date:
          </Field.Label>
          <VStack alignItems="start" gap={1}>
            <HStack>
              <DatePicker
                name="date-input"
                value={cutoffDateValue}
                onValueChange={handleCutoffDateChange}
                max={today(getLocalTimeZone())}
                maxWidth="130px"
                colorPalette="blue"
              />
              <Button variant="ghost" onClick={handleClearCutoffDate} disabled={!settings?.cutoffDate}>
                Clear
              </Button>
            </HStack>
            <Field.HelperText>When set, any PRs created before this date will not be shown.</Field.HelperText>
          </VStack>
        </HStack>
      </Field.Root>

      <Field.Root>
        <HStack alignItems="center">
          <Field.Label width="100px" pt={2}>
            Enable notifications?
          </Field.Label>
          <Switch.Root
            checked={settings?.enableNotifications ?? false}
            onChange={handleToggleEnableNotifications}
            disabled={!isNotificationsSupported}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>

            {!isNotificationsSupported && (
              <Field.HelperText>
                <Badge colorPalette="yellow">
                  <IoWarning />
                  This browser does not support notifications
                </Badge>
              </Field.HelperText>
            )}
          </Switch.Root>
        </HStack>
      </Field.Root>

      <RepoListbox value={settings?.ignored?.repos ?? []} onChange={handleIgnoredRepoChange} />
    </VStack>
  );
}
