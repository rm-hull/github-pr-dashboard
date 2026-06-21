import { Button } from "@chakra-ui/react";
import { useCallback } from "react";
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

  const handleReview = useCallback(() => {
    mutate({ owner, repo, pull_number, body: "/gemini review" });
  }, [mutate, owner, repo, pull_number]);
  return (
    <Button onClick={handleReview} disabled={disabled}>
      Gemini review
    </Button>
  );
}
