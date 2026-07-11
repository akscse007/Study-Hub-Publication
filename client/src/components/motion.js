export const viewportConfig = {
  once: false,
  // "some" (any part visible) instead of a fixed 0.2 fraction: page-level
  // sections grow far taller than the viewport on mobile (single-column
  // grids), so 20% of them can never be on screen at once and the section
  // would stay stuck at opacity 0.
  amount: "some"
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

