import { Button, Field, HStack, Switch, VStack } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useCallback, useEffect } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";
import { toaster } from "../ui/toaster";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();

  const enableNotifications = useCallback(async () => {
    if (settings?.enableNotifications && Notification.permission !== "granted") {
      const reason = await Notification.requestPermission();
      if (reason === "denied") {
        queueMicrotask(() =>
          toaster.create({
            title: "Notifications are disabled",
            description: `You have disabled notifications for this site. Please enable them in your browser settings to use this feature.`, // TODO: More descriptive message
            type: "warning",
            duration: 9000,
            closable: true,
          })
        );
        return await updateSettings({ ...settings, enableNotifications: false });
      } else if (reason === "granted") {
        queueMicrotask(() =>
          toaster.create({
            title: "Notifications enabled",
            description: "Notifications have been enabled for this site.",
            type: "success",
            duration: 5000,
            closable: true,
          })
        );
      }
    }
  }, [settings, updateSettings]);

  useEffect(() => void enableNotifications(), [enableNotifications]);

  const handleCutoffDateChange = useCallback(
    (dt?: Date) => void updateSettings({ ...(settings ?? {}), cutoffDate: dt?.getTime() }),
    [settings, updateSettings]
  );

  const handleToggleEnableNotifications = useCallback(() => {
    void updateSettings({ ...settings, enableNotifications: !(settings?.enableNotifications ?? false) });
  }, [settings, updateSettings]);

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
              <Button
                variant="ghost"
                onClick={() => void handleCutoffDateChange(undefined)}
                disabled={!settings?.cutoffDate}
              >
                Clear
              </Button>
            </HStack>
            <Field.HelperText>When set, any PRs created before this date will not be shown.</Field.HelperText>
          </VStack>
        </HStack>
      </Field.Root>

      <Field.Root>
        <HStack alignItems="top">
          <Field.Label width="100px">Enable notifications?</Field.Label>
          <Switch.Root checked={settings?.enableNotifications ?? false} onChange={handleToggleEnableNotifications}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>
      </Field.Root>
    </VStack>
  );
}
