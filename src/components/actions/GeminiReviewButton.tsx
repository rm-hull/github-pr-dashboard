import { Button } from "@chakra-ui/react";
import { useErrorToast } from "@/hooks/useErrorToast";
import { useGeminiReview } from "@/hooks/useGeminiReview";

interface GeminiReviewButton {
  owner: string;
  repo: string;
  pull_number: number;
  state: string;
}

export function GeminiReviewButton({ owner, repo, pull_number, state }: GeminiReviewButton) {
  const { mutate, isPending, error } = useGeminiReview();
  const disabled = isPending || state === "closed";

  useErrorToast("gemini-review-error", "Failed to request Gemini review", error);

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number })} disabled={disabled}>
      Gemini review
    </Button>
  );
}
