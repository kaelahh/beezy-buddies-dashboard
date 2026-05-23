// ═══════════════════════════════════════════════════════════════
// router.js — Hash-based client-side routing
// ═══════════════════════════════════════════════════════════════

function useHash() {
  const [hash, setHash] = React.useState(() => window.location.hash.slice(1) || "/");

  React.useEffect(() => {
    const handler = () => setHash(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (path) => { window.location.hash = path; };

  return [hash, navigate];
}