import { sha256 } from "js-sha256";

function base64URLEncode(str: Uint8Array) {
  return btoa(String.fromCharCode(...Array.from(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateCodeVerifier() {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

export function generateCodeChallenge(verifier: string) {
  const hash = sha256.arrayBuffer(verifier);
  return base64URLEncode(new Uint8Array(hash));
}
