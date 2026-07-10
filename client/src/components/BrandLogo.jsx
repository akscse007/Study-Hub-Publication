// Single source of truth for the publication logo. Swap /public/logo.png
// (served from the site root) to rebrand everywhere at once.
const LOGO_SRC = "/logo.png";

const BrandLogo = ({ className = "", alt = "Study-Hub Publication logo" }) => (
  <img src={LOGO_SRC} alt={alt} className={`brand-logo ${className}`.trim()} />
);

export default BrandLogo;
