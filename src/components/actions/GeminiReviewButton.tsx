import { Button } from "@chakra-ui/react";
import { useComment } from "@/hooks/useComment";
import { useErrorToast } from "@/hooks/useErrorToast";

interface GeminiReviewButton {
  owner: string;
  repo: string;
  pull_number: number;
  user?: string;
}

export function GeminiReviewButton({ owner, repo, pull_number }: GeminiReviewButton) {
  const { mutate, isPending, error } = useComment();

  useErrorToast("gemini-review-error", "Failed to post a comment", error);

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number, body: "/gemini review" })} disabled={isPending}>
      Gemini review
    </Button>
  );
}
