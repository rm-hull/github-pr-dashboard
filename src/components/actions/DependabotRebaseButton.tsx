import { Button } from "@chakra-ui/react";
import { useComment } from "@/hooks/useComment";
import { useErrorToast } from "@/hooks/useErrorToast";

interface DependabotRebaseButtonProps {
  owner: string;
  repo: string;
  pull_number: number;
  user?: string;
}

export function DependabotRebaseButton({ owner, repo, pull_number, user }: DependabotRebaseButtonProps) {
  const { mutate, isPending, error } = useComment();
  const disabled = user !== "dependabot[bot]" || isPending;

  useErrorToast("gemini-review-error", "Failed to post a comment", error);

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number, body: "@dependabot rebase" })} disabled={disabled}>
      Dependabot rebase
    </Button>
  );
}
