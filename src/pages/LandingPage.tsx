import { Shield, MapPin, Bug, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // ✅ use t here

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar with Language Toggle */}
      <div className="flex justify-end p-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select
            onValueChange={(lng) => i18n.changeLanguage(lng)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("landing.title")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-6">
            {t("landing.subtitle")}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-card text-foreground hover:bg-accent"
              onClick={() => navigate("/index")}
            >
              {t("landing.getStarted")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-card text-foreground hover:bg-accent"
              onClick={() => navigate("/HandlerLogin")}
            >
              {t("landing.loginHandler")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Bug className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">
                {t("landing.features.identifyTitle")}
              </h3>
              <p className="text-muted-foreground">
                {t("landing.features.identifyDesc")}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-4 text-destructive" />
              <h3 className="font-semibold mb-2">
                {t("landing.features.reportTitle")}
              </h3>
              <p className="text-muted-foreground">
                {t("landing.features.reportDesc")}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-success" />
              <h3 className="font-semibold mb-2">
                {t("landing.features.findTitle")}
              </h3>
              <p className="text-muted-foreground">
                {t("landing.features.findDesc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-6 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} VenomVision. {t("landing.footer")}
      </footer>
    </div>
  );
}