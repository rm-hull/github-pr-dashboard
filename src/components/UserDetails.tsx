import { Image, Text } from "@chakra-ui/react";
import { SearchHighlight } from "./SearchHighlight";

type UserDetailsProps = {
  user: null | {
    login: string;
    avatar_url: string;
  };
  searchTerm?: string;
};

export function UserDetails({ user, searchTerm }: UserDetailsProps) {
  return (
    <Text as="span" fontSize="xs" color="fg.muted" display="inline-flex" gap={1}>
      <Image
        src={user?.avatar_url}
        boxSize="18px"
        borderRadius={user?.login?.endsWith("[bot]") ? "3px" : "full"}
        fit="cover"
        border="0.5px solid"
        borderColor="fg.subtle"
      />
      <SearchHighlight query={searchTerm}>{user?.login ?? "unknown"}</SearchHighlight>
    </Text>
  );
}