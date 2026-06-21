import { IconButton } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { MdRefresh } from "react-icons/md";
import { Tooltip } from "../ui/tooltip";

export function RefreshDataButton() {
  const qc = useQueryClient();

  const handleRefresh = useCallback(() => {
    void qc.invalidateQueries();
  }, [qc]);

  return (
    <Tooltip content="Refresh data">
      <IconButton onClick={handleRefresh}>
        <MdRefresh />
      </IconButton>
    </Tooltip>
  );
}
