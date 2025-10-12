import { useEffect, useMemo, useState } from "react";
import { Octokit } from "@octokit/rest";

export const useApiClient = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("gh_token"));

  useEffect(() => {
    const listener = (e: CustomEvent<string | null>) => setToken(e.detail);
    window.addEventListener("auth-token-change", listener as EventListener);
    return () => window.removeEventListener("auth-token-change", listener as EventListener);
  }, []);

  return {
    octokit: useMemo(() => new Octokit({ auth: token }), [token]),
    isAuthenticated: !!token,
  };
};
