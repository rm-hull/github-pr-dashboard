import { useComment } from "@/hooks/useComment";
import { Button } from "@chakra-ui/react";

interface DependabotRebaseButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  user?: string;
}

export function DependabotRebaseButton({ owner, repo, pull_number, user }: DependabotRebaseButtonProps) {
  const { mutate, isPending } = useComment();
  const disabled = user !== "dependabot[bot]" || isPending;

  return (
    <Button
      size="sm"
      onClick={() => mutate({ owner, repo, pull_number, body: "@dependabot rebasr" })}
      disabled={disabled}
      variant="subtle"
    >
      Dependabot Rebase
    </Button>
  );
}
