import { Card, CardContent } from "@/components/ui/card";
import { LANDING_PAGE } from "@/lib/constants";

export function FeaturesSection() {
  const { title, subtitle, cards } = LANDING_PAGE.features;

  return (
    <section className="w-full py-12 md:py-24 bg-muted flex items-center justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {title}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            {subtitle}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 w-full max-w-7xl">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Icon className="h-12 w-12" />
                  <h3 className="text-xl font-bold">{card.title}</h3>
                  <p className="text-center text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}