import { useLocalStorage } from "@rm-hull/use-local-storage";

export interface GeneralSettings {
  ignores?: Record<string, number>;
}

type UseGeneralSettingsReturnType = {
  settings: GeneralSettings | undefined;
  updateSettings: (value: GeneralSettings | undefined) => void;
  isLoading: boolean;
};

export function useGeneralSettings(): UseGeneralSettingsReturnType {
  const { value, setValue, isLoading } = useLocalStorage<GeneralSettings>("github-pr-dashboard.general-settings");
  return {
    settings: value,
    updateSettings: setValue,
    isLoading,
  };
}
