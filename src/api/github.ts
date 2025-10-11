const GITHUB_API = "https://api.github.com";

async function fetchWithAuth(input: RequestInfo, init?: RequestInit, token?: string) {
  if (!token) {
    throw new Error("No token provided");
  }

  const headers = new Headers(init?.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/vnd.github+json");

  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    throw new Error("Unauthorized — token may be expired or revoked");
  }
  return res;
}

export async function fetchCurrentUser(token?: string) {
  const res = await fetchWithAuth(`${GITHUB_API}/user`, undefined, token);
  return res.json();
}

export async function searchOpenPRsForUser(user: string, token?: string) {
  const q = encodeURIComponent(`user:${user} type:pr state:open`);
  const res = await fetchWithAuth(`${GITHUB_API}/search/issues?q=${q}&per_page=100`, undefined, token);
  const data = await res.json();
  return data.items as any[];
}

export async function fetchPRDetails(owner: string, repo: string, number: number, token?: string) {
  const res = await fetchWithAuth(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${number}`, undefined, token);
  return res.json();
}

export async function fetchCheckRuns(owner: string, repo: string, sha: string, token?: string) {
  const res = await fetchWithAuth(`${GITHUB_API}/repos/${owner}/${repo}/commits/${sha}/check-runs`, undefined, token);
  const data = await res.json();
  return data.check_runs ?? [];
}

export async function mergePR(
  repo: string,
  prNumber: number,
  token?: string,
  method: "merge" | "squash" | "rebase" = "squash"
) {
  const res = await fetchWithAuth(
    `${GITHUB_API}/repos/${repo}/pulls/${prNumber}/merge`,
    {
      method: "PUT",
      body: JSON.stringify({ merge_method: method }),
    },
    token
  );
  return res.json();
}

export async function commentOnIssue(repoFullName: string, number: number, body: string, token?: string) {
  const res = await fetchWithAuth(
    `${GITHUB_API}/repos/${repoFullName}/issues/${number}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
    token
  );
  return res.json();
}
