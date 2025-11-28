import { Heading, Container, HStack, Text, IconButton, ButtonGroup, Link } from "@chakra-ui/react";
import { Link as RouterLink, useRouterState } from "@tanstack/react-router";
import { MdLogin, MdLogout, MdOutlineSettings } from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Route as HistoryRoute } from "@/routes/github-pr-dashboard/history";
import { Route as HomeRoute } from "@/routes/github-pr-dashboard/index";
import { Route as IssuesRoute } from "@/routes/github-pr-dashboard/issues";
import { Route as StatsRoute } from "@/routes/github-pr-dashboard/stats";
import { alpha } from "@/utils/alpha";
import { SettingsDialog } from "./SettingsDialog";
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";

const navItems = [
  { label: "home", to: HomeRoute.to, tooltip: "Shows open pull requests" },
  { label: "issues", to: IssuesRoute.to, tooltip: "List all open issues" },
  { label: "history", to: HistoryRoute.to, tooltip: "Show recently merged pull requests" },
  { label: "stats", to: StatsRoute.to, tooltip: "Aggregated metrics" },
];

export function NavBar() {
  const { login, logout, inProgress } = useAuth();
  const { data: user } = useCurrentUser();
  const { location } = useRouterState();

  const isActive = (path: string) => location.pathname === path || location.pathname + "/" === path;

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
        <HStack gap={4}>
          <Heading hideBelow="md">GitHub PR Dashboard</Heading>
          <Heading hideBelow="sm" hideFrom="md">
            PR Dashboard
          </Heading>

          <HStack gap={4}>
            {navItems.map((item, index) => (
              <Tooltip key={index} content={item.tooltip}>
                <Link
                  asChild
                  fontWeight={isActive(item.to) ? "bold" : "normal"}
                  color={isActive(item.to) ? "blue.500" : "gray.400"}
                  outline="none"
                >
                  <RouterLink to={item.to}>{item.label}</RouterLink>
                </Link>
              </Tooltip>
            ))}
          </HStack>
        </HStack>

        <ButtonGroup variant="subtle" colorPalette="blue" size="sm">
          <Tooltip content="Settings">
            <SettingsDialog>
              <IconButton>
                <MdOutlineSettings />
              </IconButton>
            </SettingsDialog>
          </Tooltip>

          <ColorModeButton variant="subtle" />

          {!user && (
            <Tooltip content="Sign in with GitHub">
              <IconButton onClick={login} disabled={inProgress}>
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
