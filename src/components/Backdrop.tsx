import { Image } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export function Backdrop() {
  const url = useColorModeValue("/github-pr-dashboard/home-light.webp", "/github-pr-dashboard/home-dark.webp");
  return (
    <Image
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
      width="full"
      objectFit="cover"
      height="100vh"
      opacity={0.6}
      src={url}
    />
  );
}
