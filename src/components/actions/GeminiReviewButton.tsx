import { useComment } from "@/hooks/useComment";
import { Button } from "@chakra-ui/react";

interface GeminiReviewButton {
  owner: string;
  repo: string;
  pull_number: number;
  user?: string;
}

export function GeminiReviewButton({ owner, repo, pull_number }: GeminiReviewButton) {
  const { mutate, isPending } = useComment();

  return (
    <Button onClick={() => mutate({ owner, repo, pull_number, body: "/gemini review" })} disabled={isPending}>
      Gemini review
    </Button>
  );
}
