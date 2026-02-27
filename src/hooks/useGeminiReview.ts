import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";

const GEMINI_USER_LOGIN = "gemini-code-assist[bot]";
const GEMINI_REVIEW_COMMAND = "/gemini review";

type MutationProps = {
  owner: string;
  repo: string;
  pull_number: number;
};

export function useGeminiReview() {
  const qc = useQueryClient();
  const { octokit } = useApiClient();

  return useMutation({
    mutationFn: async ({ owner, repo, pull_number }: MutationProps) => {
      const comments = await octokit.paginate(octokit.issues.listComments, {
        owner,
        repo,
        issue_number: pull_number,
        per_page: 100,
      });

      const geminiComments = comments.filter((c) => c.user?.login === GEMINI_USER_LOGIN);

      const reviewComments = await octokit.paginate(octokit.pulls.listReviewComments, {
        owner,
        repo,
        pull_number,
        per_page: 100,
      });

      const geminiReviewComments = reviewComments.filter((c) => c.user?.login === GEMINI_USER_LOGIN);

      for (const comment of geminiComments) {
        try {
          await octokit.issues.deleteComment({ owner, repo, comment_id: comment.id });
        } catch (e) {
          console.error(`Failed to delete issue comment ${comment.id}`, e);
        }
      }

      for (const comment of geminiReviewComments) {
        try {
          await octokit.pulls.deleteReviewComment({ owner, repo, comment_id: comment.id });
        } catch (e) {
          console.error(`Failed to delete review comment ${comment.id}`, e);
        }
      }

      return octokit.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: GEMINI_REVIEW_COMMAND,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["open-prs"] }),
  });
}
