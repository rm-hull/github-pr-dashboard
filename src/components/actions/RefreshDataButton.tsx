import { IconButton } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { MdRefresh } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

export function RefreshDataButton() {
  const qc = useQueryClient();

  const handleRefresh = () => {
    qc.invalidateQueries();
  };

  return (
    <Tooltip content="Refresh data">
      <IconButton onClick={handleRefresh}>
        <MdRefresh />
      </IconButton>
    </Tooltip>
  );
}