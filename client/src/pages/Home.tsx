import { ArrowRight, LayoutGrid, Link, QrCode } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import dematicLogoLight from "@assets/40-standard-png-2025-06-17_1762978918135.png";
import dematicLogoDark from "@assets/41-standard-png-white-2025-06-17_1762956988126.png";

interface AppCard {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}


const applications: AppCard[] = [
  {
    id: "dqm",
    name: "QR Code Manager",
    description: "Generate and manage dynamic QR codes with customizable redirect URLs and detailed scan analytics.",
    icon: QrCode,
    route: "/dqm",
  },
  {
    id: "utm-builder",
    name: "UTM Builder",
    description: "Create and manage UTM campaign parameters for marketing URL tracking and analytics.",
    icon: Link,
    route: "/utm-builder",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="space-y-4 pb-8 pt-2 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <LayoutGrid className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <img
            src={theme === "light" ? dematicLogoLight : dematicLogoDark}
            alt="Dematic"
            className="mx-auto mb-2 h-6"
            data-testid="img-home-brand"
          />
          <h1 className="text-4xl font-bold tracking-tight" style={{ lineHeight: "1.1em" }} data-testid="text-home-title">
            Digital Tools
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground" data-testid="text-home-description">
          A centralized platform for Dematic digital tools.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="container-app-cards">
        {applications.map((app) => {
          const Icon = app.icon;

          return (
            <Card key={app.id} className="flex flex-col hover-elevate" data-testid={`card-app-${app.id}`}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl" data-testid={`text-app-name-${app.id}`}>
                    {app.name}
                  </CardTitle>
                </div>
                <CardDescription className="pt-2" data-testid={`text-app-description-${app.id}`}>
                  {app.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button
                  className="w-full gap-2"
                  onClick={() => setLocation(app.route)}
                  data-testid={`button-open-${app.id}`}
                >
                  Open Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="pb-4 pt-8 text-center">
        <p className="text-sm text-muted-foreground" data-testid="text-footer-note">
          More tools and applications coming soon to Digital Tools
        </p>
      </div>
    </div>
  );
}