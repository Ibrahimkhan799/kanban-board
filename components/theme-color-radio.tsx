import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
const themes = [
  {
    value: "neutral",
    label: "Neutral",
    className: "bg-neutral-200 dark:bg-neutral-800",
  },
  {
    value: "zinc",
    label: "Zinc",
    className: "bg-zinc-200 dark:bg-zinc-800",
  },
  {
    value: "slate",
    label: "Slate",
    className: "bg-slate-200 dark:bg-slate-800",
  },
  {
    value: "stone",
    label: "Stone",
    className: "bg-stone-200 dark:bg-stone-800",
  },
];

export function ThemeColorRadio() {

  const [currentTheme, setCurrentTheme] = useState("neutral");

  useEffect(() => {
    const currentTheme = localStorage.getItem("color-theme") || "neutral";
    setCurrentTheme(currentTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    // Remove all possible theme classes first
    themes.forEach((theme) => {
      document.documentElement.classList.remove(theme.value);
    });

    // Add new theme class
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("color-theme", newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <div className="flex flex-row gap-1">
      {themes.map((theme) => (
        <button
          key={theme.value}
          onClick={() => handleThemeChange(theme.value)}
          className="flex flex-col items-center gap-2 group"
        >
          <div
            className={cn(
              "h-8 w-8 rounded-md border-2 border-transparent ring-offset-background transition-all",
              "hover:border-primary/50",
              currentTheme === theme.value && "border-primary",
              theme.className
            )}
          />
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {theme.label}
          </span>
        </button>
      ))}
    </div>
  );
}
