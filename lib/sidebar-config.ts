import { BarChart2, Clock, LayoutDashboard, LucideProps, Search, Settings, Trash2 } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type SidebarItem = {
  title: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  href: string;
  isCommand?: boolean;
};

export const sidebarConfig: Record<string, SidebarItem[]> = {
  main: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/board",
    },
    {
      title: "Analytics",
      icon: BarChart2,
      href: "/board/analytics",
    },
  ],
  tools: [
    {
      title: "Recent",
      icon: Clock,
      href: "/board/recent",
    },
    {
      title: "Search",
      icon: Search,
      href: "#",
      isCommand: true,
    },
    {
      title: "Trash",
      icon: Trash2,
      href: "/board/trash",
    },
  ],
  settings: [
    {
      title: "Settings",
      icon: Settings,
      href: "/board/settings",
    },
  ],
};