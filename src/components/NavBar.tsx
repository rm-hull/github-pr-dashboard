import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Heading, Container, HStack, Text, IconButton, ButtonGroup } from "@chakra-ui/react";
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";
import { alpha } from "@/utils/alpha";
import { MdLogin, MdLogout } from "react-icons/md";
import { MdInfoOutline } from "react-icons/md";
import { AboutDialog } from "./AboutDialog";

export function NavBar() {
  const { login, logout } = useAuth();
  const { data: user } = useCurrentUser();
  const bgColor = useColorModeValue(
    alpha("blue.50", 0.5), // light
    alpha("blue.800", 0.3) // dark
  );

  const borderColor = useColorModeValue("blue.100", "blue.900");

  return (
    <Container
      py={2}
      maxW="container.md"
      position="sticky"
      top={0}
      bg={bgColor}
      backdropFilter="saturate(180%) blur(5px)"
      borderBottom="1px solid"
      borderColor={borderColor}
      zIndex={100}
    >
      <HStack gap={6} align="center" justify="space-between">
        <Heading>GitHub PR Dashboard</Heading>

        <ButtonGroup variant="subtle" colorPalette="blue" size="sm">
          <Tooltip content="About">
            <AboutDialog>
              <IconButton>
                <MdInfoOutline />
              </IconButton>
            </AboutDialog>
          </Tooltip>

          <ColorModeButton variant="subtle" />

          {!user && (
            <Tooltip content="Sign in with GitHub">
              <IconButton onClick={login}>
                <MdLogin size="md" />
              </IconButton>
            </Tooltip>
          )}

          {!!user && (
            <Tooltip
              content={
                <Text textAlign="center">
                  Logout
                  <br />
                  (Logged in as: <strong>{user.login}</strong>)
                </Text>
              }
            >
              <IconButton
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              >
                <MdLogout />
              </IconButton>
            </Tooltip>
          )}
        </ButtonGroup>
      </HStack>
    </Container>
  );
}
