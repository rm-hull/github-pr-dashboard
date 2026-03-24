import { Button, Menu, MenuSelectionDetails, Portal } from "@chakra-ui/react";
import { useComment } from "@/hooks/useComment";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useCallback } from "react";

interface DependabotRebaseButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  user?: string;
  state: string;
}

export function DependabotRebaseButton({ owner, repo, pull_number, user, state }: DependabotRebaseButtonProps) {
  const { mutate, isPending, error } = useComment();
  const disabled = user !== "dependabot[bot]" || isPending || state === "closed";

  useErrorToast("gemini-review-error", "Failed to post a comment", error);
  const handleSelect = useCallback(
    (details: MenuSelectionDetails) => {
      mutate({ owner, repo, pull_number, body: `@dependabot ${details.value}` });
    },
    [owner, repo, pull_number]
  );

  return (
    <Menu.Root onSelect={handleSelect}>
      <Menu.Trigger asChild>
        <Button disabled={disabled}>Dependabot...</Button>
      </Menu.Trigger>
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
