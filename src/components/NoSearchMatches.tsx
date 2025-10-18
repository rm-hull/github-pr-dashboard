import { Image } from "@chakra-ui/react";

export function NoSearchMatches() {
  return (
    <Image
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      width="full"
      objectFit="contain"
      height="calc(100vh - 100px)"
      opacity={0.6}
      src="/github-pr-dashboard/no-search-matches.webp"
    />
  );
}
