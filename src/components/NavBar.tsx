import { Heading, Container, HStack, Text, IconButton, ButtonGroup } from "@chakra-ui/react";
import { MdLogin, MdLogout, MdOutlineSettings } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { alpha } from "@/utils/alpha";
import { SettingsDialog } from "./SettingsDialog";
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";

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
      maxW="full"
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
            <SettingsDialog>
              <IconButton>
                <MdOutlineSettings />
              </IconButton>
            </SettingsDialog>
          </Tooltip>

          <ColorModeButton variant="subtle" />

          {!user && (
            <Tooltip content="Sign in with GitHub">
              <IconButton onClick={login}>
                <MdLogin />
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
              <IconButton onClick={logout}>
                <MdLogout />
              </IconButton>
            </Tooltip>
          )}
        </ButtonGroup>
      </HStack>
    </Container>
  );
}
