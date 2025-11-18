import { createListCollection, Listbox, Center, Spinner } from "@chakra-ui/react";
import { ValueChangeDetails } from "@zag-js/listbox";
import { useRef, useEffect, useCallback } from "react";
import { useIntersection } from "react-use";
import { useRepos } from "@/hooks/useRepos";

type RepoListboxProps = {
  value: string[];
  onChange: (values: string[]) => void;
};

export function RepoListbox({ value, onChange }: RepoListboxProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRepos();
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  });

  useEffect(() => {
    if (intersection?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [intersection, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRepos = createListCollection({
    items: data?.pages.flatMap((page) => page.map((repo) => repo.full_name)) ?? [],
  });

  const handleRepoIgnoreDetailChange = useCallback(
    (details: ValueChangeDetails) => {
      onChange(details.value);
    },
    [onChange]
  );

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
        <div ref={intersectionRef} />
        {isFetchingNextPage && (
          <Center p={2}>
            <Spinner size="sm" />
          </Center>
        )}
      </Listbox.Content>
    </Listbox.Root>
  );
}
