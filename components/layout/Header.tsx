import Link from "next/link";
import { Kanban } from "lucide-react";
import { LANDING_PAGE } from "@/lib/constants";

export function Header() {
  const { logo, links } = LANDING_PAGE.navigation;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link className="flex items-center gap-2" href={logo.href}>
          <Kanban className="h-6 w-6" />
          <span className="font-bold text-xl">{logo.text}</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          {links.map((link, index) => (
            <Link 
              key={index}
              className="text-sm font-medium hover:text-primary" 
              href={link.href}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}