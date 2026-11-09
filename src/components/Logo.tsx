import { Link } from "react-router-dom";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={`logo${inverse ? " logo--inverse" : ""}`} aria-label="Percebera, página inicial">
      <span className="logo__name">Percebera</span>
    </Link>
  );
}
