import { createListCollection, Listbox, Center, Spinner, Field, HStack, VStack, Text } from "@chakra-ui/react";
import { ValueChangeDetails } from "@zag-js/listbox";
import { useInView } from "framer-motion";
import { useEffect, useCallback, useRef } from "react";
import { useRepos } from "@/hooks/useRepos";

type RepoListboxProps = {
  value: string[];
  onChange: (values: string[]) => void;
};

export function RepoListbox({ value, onChange }: RepoListboxProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isEnabled } = useRepos();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRepos = createListCollection({
    items: data?.pages.flatMap((page) => page.map((repo) => repo.full_name)) ?? [],
  });

  const handleRepoIgnoreDetailChange = useCallback(
    (details: ValueChangeDetails) => {
      onChange(details.value);
    },
    [onChange]
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <Field.Root>
      <HStack alignItems="start">
        <Field.Label width="100px" pt={2}>
          Ignore repos:
        </Field.Label>
        <VStack alignItems="start" gap={1}>
          <Listbox.Root
            collection={allRepos}
            selectionMode="multiple"
            value={value}
            onValueChange={handleRepoIgnoreDetailChange}
          >
            <Listbox.Content height={200} width={300}>
              {allRepos.items.map((repo) => (
                <Listbox.Item item={repo} key={repo}>
                  <Listbox.ItemText>{repo}</Listbox.ItemText>
                  <Listbox.ItemIndicator />
                </Listbox.Item>
              ))}
              <div ref={ref} />
              {(isLoading || isFetchingNextPage) && (
                <Center gap={2}>
                  <Spinner size="xs" color="fg.info" />
                  <Text textStyle="sm" color="fg.muted">
                    Loading...
                  </Text>
                </Center>
              )}
            </Listbox.Content>
          </Listbox.Root>
        </VStack>
      </HStack>
    </Field.Root>
  );
}
