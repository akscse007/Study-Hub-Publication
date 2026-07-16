import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// The browser would otherwise restore the previous page's scroll offset on
// SPA navigations (notably on mobile back/forward); we take over so every
// route change starts at the top.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
