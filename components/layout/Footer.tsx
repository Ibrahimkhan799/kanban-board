import Link from "next/link";
import { LANDING_PAGE } from "@/lib/constants";

export function Footer() {
  const { copyright, links } = LANDING_PAGE.navigation.footer;
  
  return (
    <footer className="flex flex-row justify-between p-4 w-full">
      <p className="text-sm text-muted-foreground">
        {copyright}
      </p>
      <nav className="flex gap-4 sm:gap-6">
        {links.map((link, index) => (
          <Link 
            key={index}
            className="text-sm text-muted-foreground hover:text-primary" 
            href={link.href}
          >
            {link.text}
          </Link>
        ))}
      </nav>
    </footer>
  );
}