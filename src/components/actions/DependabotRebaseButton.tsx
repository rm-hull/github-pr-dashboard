import { Button, IconButton, Menu, MenuSelectionDetails, Portal } from "@chakra-ui/react";
import { useCallback } from "react";
import { MdBuild } from "react-icons/md";
import { useComment } from "@/hooks/useComment";
import { useErrorToast } from "@/hooks/useErrorToast";

interface DependabotRebaseButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  user?: string;
  state: string;
  iconOnly?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

export function DependabotRebaseButton({ owner, repo, pull_number, user, state, iconOnly = false, size }: DependabotRebaseButtonProps) {
  const { mutate, isPending, error } = useComment();
  const disabled = user !== "dependabot[bot]" || isPending || state === "closed";

  useErrorToast("dependabot-rebase-error", "Failed to post a comment", error);
  const handleSelect = useCallback(
    (details: MenuSelectionDetails) => {
      mutate({ owner, repo, pull_number, body: `@dependabot ${details.value}` });
    },
    [owner, repo, pull_number, mutate]
  );

  const trigger = iconOnly ? (
    <IconButton disabled={disabled} aria-label="Dependabot" size={size} variant="ghost" colorPalette="blue">
      <MdBuild />
    </IconButton>
  ) : (
    <Button disabled={disabled}>Dependabot...</Button>
  );

  return (
    <Menu.Root onSelect={handleSelect}>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="rebase">Rebase</Menu.Item>
            <Menu.Item value="recreate">Recreate</Menu.Item>
            <Menu.Separator />
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Ignore</Menu.ItemGroupLabel>
              <Menu.Item value="ignore this major version">major version</Menu.Item>
              <Menu.Item value="ignore this minor version">minor version</Menu.Item>
              <Menu.Item value="ignore this dependency">this dependency</Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
