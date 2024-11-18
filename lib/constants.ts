import { Card } from "./types";
import { Layout, Calendar, CheckCircle2, Sparkles } from "lucide-react";

export const DEFAULT_CARDS : Card[] = [
  {title  : "Look into render bug in dashboard", column : "backlog"},
  {title: "Design new landing page", column: "todo"},
  {title: "Add authentication flow", column: "in-progress"},
  {title: "Update dependencies", column: "complete"},
  {title: "Refactor CSS modules", column: "backlog"},
  {title: "Write documentation", column: "todo"},
  {title: "Fix mobile responsiveness", column: "in-progress"},
  {title: "Add dark mode support", column: "backlog"},
  {title: "Optimize build size", column: "complete"},
  {title: "Setup CI/CD pipeline", column: "todo"},
  {title: "Add error boundaries", column: "backlog"}
].map((card, index) => ({...card as Card, id: index + 1}));

export const DISTANCE_OFFSET = 50;

export const DEFAULT_COLUMNS = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "complete",
    label: "Complete",
  },
] as const;

export const LANDING_PAGE = {
  hero: {
    badge: {
      text: "🚀 Streamline your workflow",
      icon: Sparkles
    },
    title: {
      line1: "Modern Task Management",
      line2: "Made Simple"
    },
    description: "A powerful Kanban board inspired by Notion. Organize your tasks with style and efficiency.",
    buttons: [
      {
        text: "Get Started",
        href: "/signup",
        variant: "default"
      },
      {
        text: "Learn More",
        href: "#features",
        variant: "outline"
      }
    ]
  },
  features: {
    title: "Features",
    subtitle: "Everything you need to manage your tasks effectively",
    cards: [
      {
        icon: Layout,
        title: "Intuitive Interface",
        description: "Clean and modern interface that makes task management a breeze"
      },
      {
        icon: Calendar,
        title: "Smart Organization",
        description: "Organize tasks with custom labels, due dates, and priorities"
      },
      {
        icon: CheckCircle2,
        title: "Progress Tracking",
        description: "Monitor project progress with visual boards and status updates"
      }
    ]
  },
  navigation: {
    logo: {
      text: "Notion Kanban",
      href: "/"
    },
    links: [
      {
        text: "Login",
        href: "/login"
      },
      {
        text: "Sign Up",
        href: "/signup"
      }
    ],
    footer: {
      copyright: "© 2024 Notion Kanban. All rights reserved.",
      links: [
        {
          text: "Terms",
          href: "#"
        },
        {
          text: "Privacy",
          href: "#"
        }
      ]
    }
  }
};