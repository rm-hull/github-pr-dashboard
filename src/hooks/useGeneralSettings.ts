import { useLocalStorage } from "@rm-hull/use-local-storage";

// Single source of truth for the allowed list view values at runtime.
const LIST_VIEW_BY = ["repo", "recent"] as const;
export type ListViewBy = (typeof LIST_VIEW_BY)[number];

export interface GeneralSettings {
  ignores?: Record<string, number>;
  listViewBy?: ListViewBy;
  cutoffDate?: number;
  enableNotifications?: boolean;
}

export function isListViewBy(v: unknown): v is ListViewBy {
  return typeof v === "string" && (LIST_VIEW_BY as readonly string[]).includes(v);
}

type UseGeneralSettingsReturnType = {
  settings: GeneralSettings | undefined;
  updateSettings: (value: GeneralSettings | undefined) => Promise<void>;
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
