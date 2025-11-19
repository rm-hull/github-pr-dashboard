import { createListCollection, Listbox, Center, Spinner } from "@chakra-ui/react";
import { ValueChangeDetails } from "@zag-js/listbox";
import { useInView } from "framer-motion";
import { useEffect, useCallback, useRef } from "react";
import { useRepos } from "@/hooks/useRepos";

type RepoListboxProps = {
  value: string[];
  onChange: (values: string[]) => void;
};

export function RepoListbox({ value, onChange }: RepoListboxProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useRepos();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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

  if (isLoading && !data) {
    return (
      <Center p={4}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Listbox.Root
      collection={allRepos}
      selectionMode="multiple"
      height={200}
      value={value}
      onValueChange={handleRepoIgnoreDetailChange}
    >
      <Listbox.Content>
        {allRepos.items.map((repo) => (
          <Listbox.Item item={repo} key={repo}>
            <Listbox.ItemText>{repo}</Listbox.ItemText>
            <Listbox.ItemIndicator />
          </Listbox.Item>
        ))}
        <div ref={ref} />
        {isFetchingNextPage && (
          <Center p={2}>
            <Spinner size="sm" color="blue" />
          </Center>
        )}
      </Listbox.Content>
    </Listbox.Root>
  );
}
