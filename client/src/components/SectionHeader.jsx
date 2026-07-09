import { Link } from "react-router-dom";

const SectionHeader = ({ title, subtitle, kicker, actionLabel, actionTo }) => (
  <div className="section-heading">
    <div>
      {kicker ? <span className="section-kicker">{kicker}</span> : null}
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
    {actionLabel ? (
      actionTo ? (
        <Link to={actionTo} className="section-action">
          {actionLabel} →
        </Link>
      ) : (
        <span className="section-action">{actionLabel} →</span>
      )
    ) : null}
  </div>
);

export default SectionHeader;

