import { Shield, MapPin, Smartphone, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">🐍 VenomVision</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-6">
            Instantly identify snakes, report bites, and connect with certified handlers — all in one app.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-card text-foreground hover:bg-accent"
              onClick={() => navigate("/index")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signup-handler")}
            >
              Register as Handler
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Bug className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Identify Snakes</h3>
              <p className="text-muted-foreground">
                Upload or capture an image to instantly identify snake species.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-4 text-destructive" />
              <h3 className="font-semibold mb-2">Report Bites</h3>
              <p className="text-muted-foreground">
                Submit bite incidents with GPS to get emergency guidance fast.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-success" />
              <h3 className="font-semibold mb-2">Find Handlers</h3>
              <p className="text-muted-foreground">
                Connect with nearby certified snake handlers for rescue.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}