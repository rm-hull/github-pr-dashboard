import { Button, Field, HStack, VStack } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useCallback } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();

  const handleCutoffDateChange = useCallback(
    (dt?: Date) => void updateSettings({ ...(settings ?? {}), cutoffDate: dt?.getTime() }),
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
    </VStack>
  );
}
