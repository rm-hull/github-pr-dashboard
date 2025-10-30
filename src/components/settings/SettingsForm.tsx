import { Button, Field, HStack, VStack } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useCallback } from "react";
import { useGeneralSettings } from "@/hooks/useGeneralSettings";

export function SettingsForm() {
  const { settings, updateSettings } = useGeneralSettings();

  const handleCutoffDateChange = useCallback(
    (dt?: Date) => void updateSettings({ ...settings, cutoffDate: dt?.getTime() }),
    [settings, updateSettings]
  );

  return (
    <VStack>
      <Field.Root>
        <HStack>
          <Field.Label width="100px">Cutoff date:</Field.Label>
          <SingleDatepicker
            propsConfigs={{
              triggerBtnProps: {
                width: "116px",
              },
            }}
            configs={{}}
            name="date-input"
            usePortal
            date={settings?.cutoffDate === undefined ? undefined : new Date(settings?.cutoffDate)}
            onDateChange={handleCutoffDateChange}
            maxDate={new Date()}
          />
          <Button variant="ghost" onClick={() => handleCutoffDateChange(undefined)} disabled={!settings?.cutoffDate}>
            Clear
          </Button>
        </HStack>
        <Field.HelperText ml="108px">When set, any PRs created before this date will not be shown.</Field.HelperText>
      </Field.Root>
    </VStack>
  );
}
