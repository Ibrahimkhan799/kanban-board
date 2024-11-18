import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LANDING_PAGE } from "@/lib/constants";

export function HeroSection() {
  const { badge, title, description, buttons } = LANDING_PAGE.hero;
  const BadgeIcon = badge.icon;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-8 text-center w-full">
          <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
            {badge.text}
            <BadgeIcon className="ml-2 h-4 w-4" />
          </div>
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl mx-auto leading-tight w-full max-w-6xl">
            {title.line1}
            <br />
            {title.line2}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {description}
          </p>
          <div className="flex gap-4">
            {buttons.map((button, index) => (
              <Link key={index} href={button.href}>
                <Button 
                  variant={button.variant as "default" | "outline"}
                  size="lg" 
                  className="gap-2"
                >
                  {button.text}
                  {index === 0 && <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}