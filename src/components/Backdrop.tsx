import { Image } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export function Backdrop() {
  const url = useColorModeValue("/github-pr-dashboard/home-light.webp", "/github-pr-dashboard/home-dark.webp");
  return (
    <Image
      position="absolute"
      top="52px"
      left={0}
      bottom={0}
      right={0}
      width="full"
      objectFit="cover"
      height="calc(100vh - 52px)"
      opacity={0.6}
      src={url}
    />
  );
}
