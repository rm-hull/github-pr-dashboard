import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./useApiClient";

type FetchOptions = {
  isActive: boolean;
};

export function useLatestActionsStatus(owner: string, repo: string, options: Partial<FetchOptions> = {}) {
  const { octokit } = useApiClient();

  return useQuery({
    queryKey: ["latest-action-status", `${owner}/${repo}`],
    queryFn: async () => {
      const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
      const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
        owner,
        repo,
        branch: repoData.default_branch,
        event: "push",
        per_page: 1,
      });

      if (runs.total_count === 0 || runs.workflow_runs.length === 0) {
        return null;
      }

      const latestRun = runs.workflow_runs[0];

      return {
        success: latestRun.conclusion === "success",
        status: latestRun.status,
        conclusion: latestRun.conclusion,
        runId: latestRun.id,
        htmlUrl: latestRun.html_url,
        sha: latestRun.head_sha,
        branch: repoData.default_branch,
        createdAt: latestRun.created_at,
      };
    },
    enabled: options.isActive,
  });
}
