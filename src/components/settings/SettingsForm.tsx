import { Button, Field, HStack, Switch, VStack } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useCallback } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { RepoListbox } from "./RepoListbox";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();

  const handleCutoffDateChange = useCallback(
    (dt?: Date) => void updateSettings({ ...(settings ?? {}), cutoffDate: dt?.getTime() }),
    [settings, updateSettings]
  );

  const handleClearCutoffDate = useCallback(() => handleCutoffDateChange(undefined), [handleCutoffDateChange]);

  const handleToggleEnableNotifications = useCallback(() => {
    void updateSettings({ ...(settings ?? {}), enableNotifications: !(settings?.enableNotifications ?? false) });
  }, [settings, updateSettings]);

  const handleIgnoredRepoChange = useCallback(
    (ignored: string[]) =>
      void updateSettings({ ...(settings ?? {}), ignored: { ...settings?.ignored, repos: ignored } }),
    [settings, updateSettings]
  );

  return (
    <VStack>
      <Field.Root>
        <HStack alignItems="start">
          <Field.Label width="100px" pt={2}>
            Cutoff date:
          </Field.Label>
          <VStack alignItems="start" gap={1}>
            <HStack>
              <SingleDatepicker
                propsConfigs={{
                  triggerBtnProps: {
                    width: "116px",
                  },
                }}
                configs={{}}
                name="date-input"
                usePortal
                date={settings?.cutoffDate ? new Date(settings.cutoffDate) : undefined}
                onDateChange={handleCutoffDateChange}
                maxDate={new Date()}
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
          <Switch.Root checked={settings?.enableNotifications ?? false} onChange={handleToggleEnableNotifications}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>
      </Field.Root>

      <RepoListbox value={settings?.ignored?.repos ?? []} onChange={handleIgnoredRepoChange} />
    </VStack>
  );
}
