import { fetchPRDetails, mergePR } from "@/api/github";
import { useGitHubAuth } from "@/hooks/useGitHubAuth";
import { Button, Spinner } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TiTick } from "react-icons/ti";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";
import { MdQuestionMark } from "react-icons/md";

interface MergeButtonProps {
  repo: string;
  prNumber: number;
  active?: boolean;
}

export function MergeButton({ repo, prNumber, active }: MergeButtonProps) {
  const { token } = useGitHubAuth();
  const qc = useQueryClient();
  const mergeMutation = useMutation({
    mutationFn: ({ repo, prNumber }: { repo: string; prNumber: number }) => mergePR(repo, prNumber, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-open-prs"] }),
  });

  const [owner, repoFullName] = repo.split("/");

  const { data, isLoading, error } = useQuery({
    queryKey: ["pr", repo, prNumber],
    queryFn: () => fetchPRDetails(owner, repoFullName, prNumber, token),
    staleTime: 60_000,
    enabled: !!token && active,
  });

  console.log({ data, isLoading, error });

  const disabled = !token && data?.mergeable && data?.mergeable_state === "clean";

  return (
    <Button size="sm" onClick={() => mergeMutation.mutate({ repo, prNumber })} disabled={disabled} variant="subtle">
      Merge
      {isLoading && <Spinner size="xs" />}
      {!isLoading && !data && <MdQuestionMark color="purple" />}
      {data?.mergeable_state === "clean" && <TiTick color="green" />}
      {data?.mergeable_state === "unstable" && <LiaSkullCrossbonesSolid color="red" />}
    </Button>
  );
}
