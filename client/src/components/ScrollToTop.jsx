import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// history.scrollRestoration is set to "manual" by an inline script in
// index.html — it has to run before the browser's deferred scroll
// restoration on mobile, which fires before this bundle loads. This
// component then owns scroll positioning for every SPA navigation.

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
