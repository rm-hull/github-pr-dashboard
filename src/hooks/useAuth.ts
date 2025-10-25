import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { toaster } from "@/components/ui/toaster";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce";

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI as string;

interface TokenData {
  access_token?: string;
  error?: string;
  error_description?: string;
}

const expiredAtom = atom(false);
const fetchedAtom = atom(false);

export function useAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const storedVerifier = sessionStorage.getItem("pkce_verifier");
  const [isExpired, setExpired] = useAtom(expiredAtom);
  const [hasFetched, setHasFetched] = useAtom(fetchedAtom);

  useEffect(() => {
    if (hasFetched) return;

    if (code && storedVerifier) {
      setHasFetched(true);

      fetch("https://api.destructuring-bind.org/v1/github/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          code,
          code_verifier: storedVerifier,
          redirect_uri: REDIRECT_URI,
        }),
      })
        .then((res) => res.json() as Promise<TokenData>)
        .then((data) => {
          if (data.access_token) {
            sessionStorage.setItem("gh_token", data.access_token);
            window.dispatchEvent(new CustomEvent("auth-token-change", { detail: data.access_token }));
            window.history.replaceState({}, document.title, "/github-pr-dashboard");
          } else if (data.error) {
            toaster.create({
              id: "use-auth",
              title: "Error obtaining access token:",
              description: `${data.error_description} (${data.error})`,
              type: "error",
              duration: 9000,
              closable: true,
            });
          }
          return null;
        })
        .catch((err) => {
          toaster.create({
            id: "use-auth",
            title: "Error exchanging code for token",
            description: (err as Error).message,
            type: "error",
            duration: 9000,
            closable: true,
          });
          setHasFetched(false);
        });
    }
  }, [code, storedVerifier, hasFetched, setHasFetched]);

  const login = useCallback(() => {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    sessionStorage.removeItem("gh_token");
    sessionStorage.setItem("pkce_verifier", verifier);
    setExpired(false);
    setHasFetched(false); // reset on new login

    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "repo,workflow",
        response_type: "code",
        code_challenge: challenge,
        code_challenge_method: "S256",
      }).toString();

    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = authUrl;
  }, [setExpired, setHasFetched]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("gh_token");
    sessionStorage.removeItem("pkce_verifier");
    window.dispatchEvent(new CustomEvent("auth-token-change", { detail: undefined }));
    setHasFetched(false);
    setExpired(false);
    window.location.reload();
  }, [setExpired, setHasFetched]);

  return { login, logout, isExpired, setExpired };
}
