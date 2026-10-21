import { PullRequest } from "./types";

export function isBefore(item: PullRequest, cutoffDate?: number) {
  if (!cutoffDate) {
    return false;
  }

  const createdTime = new Date(item.created_at).getTime();
  const updatedTime = item.updated_at ? new Date(item.updated_at).getTime() : createdTime;

  // Exclude only if both created and last updated are before the cutoff
  return createdTime < cutoffDate && updatedTime < cutoffDate;
}
