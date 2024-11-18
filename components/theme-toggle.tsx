"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

type ThemeToggleVariant = "tabs" | "dropdown" | "button-dropdown"

interface ThemeToggleProps {
  isCollapsed?: boolean
  variant?: ThemeToggleVariant
  className?: string
}

export function ThemeToggle({ 
  isCollapsed, 
  variant = "tabs",
  className 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn("h-8", className)}>
        <div className="w-8 h-8" />
      </div>
    )
  }

  if (variant === "dropdown") {
    return (
      <TooltipProvider>
        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={className}>
                  {theme === "light" && <Sun className="h-4 w-4" />}
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                  {theme === "system" && <Monitor className="h-4 w-4" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent side="right">
            Change theme
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (variant === "button-dropdown") {
    const button = (
      <Button 
        variant="outline" 
        size="sm" 
        className={cn(
          isCollapsed ? "h-8 w-8 p-0" : "w-full gap-1",
          className
        )}
      >
        {theme === "light" && <Sun className="h-4 w-4" />}
        {theme === "dark" && <Moon className="h-4 w-4" />}
        {theme === "system" && <Monitor className="h-4 w-4" />}
        {!isCollapsed && (
          <span className="ml-2 capitalize">{theme}</span>
        )}
      </Button>
    )

    if (isCollapsed) {
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    {button}
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="center" side="right">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipContent side="right">
                Theme
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }

    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {button}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Modified tabs variant for collapsed state
  if (isCollapsed) {
    return (
      <div className={cn("flex justify-center", className)}>
        <TooltipProvider>
          <Tooltip>
            <DropdownMenu>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {theme === "light" && <Sun className="h-4 w-4" />}
                    {theme === "dark" && <Moon className="h-4 w-4" />}
                    {theme === "system" && <Monitor className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent side="right">
              Change theme
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  // Default tabs variant (when not collapsed)
  return (
    <div className={cn("space-y-4", className)}>
      <Tabs
        defaultValue={theme}
        onValueChange={setTheme}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="light" className="w-full">
            <Sun className="h-4 w-4" />
            <span className="ml-2">Light</span>
          </TabsTrigger>
          <TabsTrigger value="dark" className="w-full">
            <Moon className="h-4 w-4" />
            <span className="ml-2">Dark</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="w-full">
            <Monitor className="h-4 w-4" />
            <span className="ml-2">System</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
} 