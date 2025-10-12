import { Box, Button, ButtonGroup, HStack, Image, Link, List, Text } from "@chakra-ui/react";
import { MergeButton } from "./MergeButton";
import { useState } from "react";
import { RestEndpointMethodTypes } from "@octokit/rest";
import { useComment } from "@/hooks/useComment";
import { DependabotRebaseButton } from "./DependabotRebaseButton";
import TimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
import JavascriptTimeAgo from "javascript-time-ago";

JavascriptTimeAgo.addDefaultLocale(en);

type Props = {
  pulls: RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"];
};

export default function PullRequestsList({ pulls }: Props) {
  const [active, setActive] = useState<number | undefined>();
  const { mutate, isPending } = useComment();

  return (
    <List.Root gap={2} listStyleType="none">
      {pulls.map((item, index) => {
        const repoFullName = item.repository_url.split("/repos/")[1];
        const [owner, repo] = repoFullName.split("/");

        return (
          <List.Item
            p={2}
            key={item.id}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(undefined)}
            _hover={{
              bg: "bg.subtle",
              cursor: "pointer",
            }}
          >
            <HStack justifyContent="space-between">
              <Box>
                <Link href={item.html_url} fontWeight="bold">
                  {item.title}
                </Link>
                <HStack gap={1}>
                  <Text fontSize="sm">
                    {repoFullName} — #{item.number}
                  </Text>
                  <Image
                    src={item.user?.avatar_url}
                    ml={3}
                    boxSize="18px"
                    borderRadius="full"
                    fit="cover"
                    border="1px solid"
                    borderColor="fg.subtle"
                  />
                  <Text fontSize="xs" color="fg.subtle" display="flex" flexDir="row" gap={2}>
                    {item.user?.login} <TimeAgo date={new Date(item.created_at)} locale="en-US" />
                  </Text>
                </HStack>
              </Box>
              <ButtonGroup>
                <MergeButton owner={owner} repo={repo} pull_number={item.number} active={index === active} />
                <DependabotRebaseButton owner={owner} repo={repo} pull_number={item.number} user={item.user?.login} />
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => mutate({ owner, repo, pull_number: item.number, body: "/gemini review" })}
                  disabled={isPending}
                >
                  Gemini Review
                </Button>
              </ButtonGroup>
            </HStack>
          </List.Item>
        );
      })}
    </List.Root>
  );
}
