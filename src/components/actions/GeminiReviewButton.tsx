import { Button } from "@chakra-ui/react";
import { useComment } from "@/hooks/useComment";
import { useErrorToast } from "@/hooks/useErrorToast";

interface GeminiReviewButton {
  owner: string;
  repo: string;
  pull_number: number;
  state: string;
}

export function GeminiReviewButton({ owner, repo, pull_number, state }: GeminiReviewButton) {
  const { mutate, isPending, error } = useComment();
  const disabled = isPending || state === "closed";

  useErrorToast("gemini-review-error", "Failed to post a comment", error);

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number, body: "/gemini review" })} disabled={disabled}>
      Gemini review
    </Button>
  );
}
