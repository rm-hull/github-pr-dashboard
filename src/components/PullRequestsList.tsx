import { useGitHubAuth } from "@/hooks/useGitHubAuth";
import { GitHubSearchItem } from "../types";
import { Box, Button, HStack, Link, List, Text } from "@chakra-ui/react";
import { MergeButton } from "./MergeButton";
import { useState } from "react";

type Props = {
  prs: GitHubSearchItem[];
  onComment: (repo: string, number: number, body: string) => Promise<void>;
};

export default function PullRequestsList({ prs, onComment }: Props) {
  const [active, setActive] = useState<number | undefined>();
  const { token } = useGitHubAuth();
  const disabled = !token;

  return (
    <List.Root gap={2}>
      {prs.map((item, index) => {
        const repoFullName = item.repository_url.split("/repos/")[1];

        return (
          <List.Item
            p={2}
            key={item.id}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(undefined)}
            _hover={{
              bg: "gray.50",
              cursor: "pointer",
            }}
          >
            <HStack justifyContent="space-between">
              <Box>
                <Link href={item.html_url} fontWeight="bold">
                  {item.title}
                </Link>
                <Text fontSize="sm">
                  {repoFullName} — #{item.number}
                </Text>
              </Box>
              <HStack>
                <MergeButton repo={repoFullName} prNumber={item.number} active={index === active} />
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => onComment(repoFullName, item.number, "@dependabot rebase")}
                  disabled={disabled}
                >
                  Dependabot Rebase
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => onComment(repoFullName, item.number, "/gemini review")}
                  disabled={disabled}
                >
                  Gemini Review
                </Button>
              </HStack>
            </HStack>
          </List.Item>
        );
      })}
    </List.Root>
  );
}
