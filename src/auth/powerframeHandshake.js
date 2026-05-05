export function runPowerframeHandshake() {
  const params = new URLSearchParams(window.location.search);
  const sessionParam = params.get("session");

  if (sessionParam) {
    try {
      const decoded = atob(sessionParam);
      const sessionData = JSON.parse(decoded);
      localStorage.setItem("powerframe_user", JSON.stringify(sessionData));

      // Clean up URL - remove session and sso params
      params.delete("session");
      params.delete("sso");

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, document.title, newUrl);
    } catch (error) {
      console.error("Failed to process Powerframe SSO session:", error);
    }
  }
}
