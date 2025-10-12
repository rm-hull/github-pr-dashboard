import { Box, Button, ButtonGroup, HStack, Image, Link, List, Text } from "@chakra-ui/react";
import { MergeButton } from "./MergeButton";
import { useState } from "react";
import { RestEndpointMethodTypes } from "@octokit/rest";
import { useComment } from "@/hooks/useComment";
import { DependabotRebaseButton } from "./DependabotRebaseButton";
import TimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
import JavascriptTimeAgo from "javascript-time-ago";
import { AnimatePresence, motion } from "framer-motion";

const MotionListItem = motion(List.Item);

JavascriptTimeAgo.addDefaultLocale(en);

type Props = {
  pulls: RestEndpointMethodTypes["search"]["issuesAndPullRequests"]["response"]["data"]["items"];
};

export default function PullRequestsList({ pulls }: Props) {
  const [active, setActive] = useState<number | undefined>();
  const { mutate, isPending } = useComment();

  return (
    <List.Root gap={2} listStyleType="none">
      <AnimatePresence>
        {pulls
          .filter((pull) => pull.state === "open")
          .map((pull, index) => {
            const repoFullName = pull.repository_url.split("/repos/")[1];
            const [owner, repo] = repoFullName.split("/");

            return (
              <MotionListItem
                layout
                exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                p={2}
                key={pull.id}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(undefined)}
                _hover={{
                  bg: "bg.subtle",
                  cursor: "pointer",
                }}
              >
                <HStack justifyContent="space-between">
                  <Box>
                    <Link href={pull.html_url} fontWeight="bold">
                      {pull.title}
                    </Link>
                    <HStack gap={1}>
                      <Text fontSize="sm">
                        {repoFullName} — #{pull.number}
                      </Text>
                      <Image
                        src={pull.user?.avatar_url}
                        ml={3}
                        boxSize="18px"
                        borderRadius="full"
                        fit="cover"
                        border="1px solid"
                        borderColor="fg.subtle"
                      />
                      <Text fontSize="xs" color="fg.subtle" display="flex" flexDir="row" gap={2}>
                        {pull.user?.login} <TimeAgo date={new Date(pull.created_at)} locale="en-US" />
                      </Text>
                    </HStack>
                  </Box>
                  <ButtonGroup>
                    <MergeButton owner={owner} repo={repo} pull_number={pull.number} active={index === active} />
                    <DependabotRebaseButton
                      owner={owner}
                      repo={repo}
                      pull_number={pull.number}
                      user={pull.user?.login}
                    />
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => mutate({ owner, repo, pull_number: pull.number, body: "/gemini review" })}
                      disabled={isPending}
                    >
                      Gemini Review
                    </Button>
                  </ButtonGroup>
                </HStack>
              </MotionListItem>
            );
          })}
      </AnimatePresence>
    </List.Root>
  );
}
