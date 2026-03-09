import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background py-8">
    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 sm:flex-row">
      <p className="font-display text-sm text-muted-foreground">
        © {new Date().getFullYear()} Kasun. All rights reserved.
      </p>
      <Link
        to="/privacy-policy"
        className="font-display text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        Privacy Policy
      </Link>
    </div>
  </footer>
);

export default Footer;
