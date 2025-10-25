import { renderHook, act } from "@testing-library/react";
import { JSDOM } from "jsdom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAuth } from "./useAuth";

class MockLocation extends URL {
  replace = vi.fn();

  constructor(url: string) {
    super(url);
  }
}

const mockLocation = new MockLocation("http://localhost");

Object.defineProperty(global, "window", {
  value: {
    ...global.window,
    location: mockLocation,
    dispatchEvent: vi.fn(),
    history: {
      replaceState: vi.fn(),
    },
  },
  writable: true,
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost" });
global.document = dom.window.document;
global.sessionStorage = dom.window.sessionStorage;

describe("useAuth", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: "mock_token" }),
      } as Response)
    );
    vi.stubGlobal("fetch", fetchSpy);
    replaceStateSpy = vi.spyOn(window.history, "replaceState");

    sessionStorage.clear();
    mockLocation.search = "";
    mockLocation.replace.mockClear();
    (global.window.dispatchEvent as ReturnType<typeof vi.fn>).mockClear();
    (global.window.history.replaceState as ReturnType<typeof vi.fn>).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    replaceStateSpy.mockRestore();
  });

  it("should call fetch exactly once when code and verifier are present and ghToken is absent", async () => {
    mockLocation.search = "?code=mock_code";
    sessionStorage.setItem("pkce_verifier", "mock_verifier");

    renderHook(() => useAuth());

    await act(() => Promise.resolve());
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem("gh_token")).toBe("mock_token");
    expect(replaceStateSpy).toHaveBeenCalledWith({}, document.title, "/github-pr-dashboard");
    expect(global.window.dispatchEvent).toHaveBeenCalledWith(expect.any(CustomEvent));
  });

  it("should not call fetch if ghToken is already present", async () => {
    mockLocation.search = "?code=mock_code";
    sessionStorage.setItem("pkce_verifier", "mock_verifier");
    sessionStorage.setItem("gh_token", "existing_token");

    renderHook(() => useAuth());

    await act(() => Promise.resolve());
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("gh_token")).toBe("existing_token");
  });

  it("should not call fetch if code is missing", async () => {
    sessionStorage.setItem("pkce_verifier", "mock_verifier");

    renderHook(() => useAuth());

    await act(() => Promise.resolve());
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("gh_token")).toBeNull();
  });

  it("should not call fetch if pkce_verifier is missing", async () => {
    mockLocation.search = "?code=mock_code";

    renderHook(() => useAuth());

    await act(() => Promise.resolve());
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("gh_token")).toBeNull();
  });
});
