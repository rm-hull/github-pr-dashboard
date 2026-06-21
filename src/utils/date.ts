import { PullRequest } from "./types";

export function isBefore(item: PullRequest, cutoffDate?: number) {
  if (!cutoffDate) {
    return false;
  }

  return new Date(item.created_at).getTime() < cutoffDate;
}
