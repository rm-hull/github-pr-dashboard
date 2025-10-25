import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce";

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI as string;

interface TokenData {
  access_token?: string;
  error?: string;
  error_description?: string;
}

const authExpiredAtom = atom(false);

export function useAuth() {
  const calledRef = useRef(false);
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const storedVerifier = sessionStorage.getItem("pkce_verifier");
  const ghToken = sessionStorage.getItem("gh_token");
  const [isExpired, setExpired] = useAtom(authExpiredAtom);

  useEffect(() => {
    if (calledRef.current) return;

    if (code && storedVerifier && !ghToken) {
      calledRef.current = true;

      // Exchange code for access token
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

            // Clean URL
            window.history.replaceState({}, document.title, "/github-pr-dashboard");
          } else if (data.error) {
            console.error("Error obtaining access token:", data.error, data.error_description);
          }
          return null;
        })
        .catch((err) => {
          console.error("Error exchanging code for token:", err);
        });
    }
  }, [code, storedVerifier, ghToken]);

  function login() {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    sessionStorage.setItem("pkce_verifier", verifier);

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
  }

  function logout() {
    sessionStorage.removeItem("gh_token");
    sessionStorage.removeItem("pkce_verifier");
    window.dispatchEvent(new CustomEvent("auth-token-change", { detail: undefined }));
  }

  return { login, logout, isExpired, setExpired };
}
