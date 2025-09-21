import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, AlertTriangle, Users, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { HandlerCard } from "@/components/HandlerCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "leaflet/dist/leaflet.css";

// Mock handlers (can be fetched from backend later)
const mockHandlers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "+91-9876543210",
    location: "Bangalore Central",
    status: "available" as const,
    experience: "15 years",
    specialization: "Venomous snakes",
  },
  {
    id: "2",
    name: "Suresh Wildlife Rescue",
    phone: "+91-9876543211",
    location: "Whitefield",
    status: "busy" as const,
    experience: "8 years",
    specialization: "Cobra specialist",
  },
  {
    id: "3",
    name: "Karnataka Forest Dept",
    phone: "+91-9876543212",
    location: "HSR Layout",
    status: "available" as const,
    experience: "Government service",
    specialization: "All species",
  },
  {
    id: "4",
    name: "Wildlife SOS",
    phone: "+91-9876543213",
    location: "Marathahalli",
    status: "unavailable" as const,
    experience: "10 years",
    specialization: "Rescue & relocation",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const { t } = useTranslation();

  // Capture GPS
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
        (err) => {
          console.error("Geolocation error:", err);
          // fallback → Bangalore
          setCoords([12.9716, 77.5946]);
        }
      );
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (coords) {
        formData.append("gps", `${coords[0]},${coords[1]}`);
      }

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${baseUrl}/api/identify`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (data.success) {
        navigate("/identify-result", {
          state: {
            result: data.result,
            image: URL.createObjectURL(file),
            gps: coords,
          },
        });
      } else {
        navigate("/identify-result", { state: { result: null } });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      navigate("/identify-result", { state: { result: null } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Action Card */}
        <Card className="mb-8 shadow-strong border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground mb-2">
              {t("home.identifyTitle")}
            </CardTitle>
            <p className="text-muted-foreground">{t("home.identifySubtitle")}</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Hidden Inputs */}
              <input
                id="cameraInput"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Capture Button */}
              <Button
                size="lg"
                onClick={() => {
                  handleGetLocation();
                  document.getElementById("cameraInput")?.click();
                }}
                className="h-16 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Camera className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">{t("home.capturePhoto")}</div>
                  <div className="text-sm opacity-90">{t("home.useCamera")}</div>
                </div>
              </Button>

              {/* Upload Button */}
              <Button
                size="lg"
                variant="outline"
                className="h-16 w-full border-2 border-primary/30 hover:border-primary/50"
                onClick={() => {
                  handleGetLocation();
                  document.getElementById("fileInput")?.click();
                }}
              >
                <Upload className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">{t("home.uploadPhoto")}</div>
                  <div className="text-sm text-muted-foreground">{t("home.fromGallery")}</div>
                </div>
              </Button>
            </div>

            {loading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center text-primary">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  {t("home.analyzing", "Analyzing image...")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-medium transition-shadow border-destructive/20"
            onClick={() => navigate("/report-bite")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-destructive p-3 rounded-lg mr-4">
                  <AlertTriangle className="h-6 w-6 text-destructive-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("home.reportBite")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("home.reportBiteDesc")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-medium transition-shadow border-primary/20"
            onClick={() => navigate("/knowledge-hub")}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary p-3 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {t("home.knowledgeHub")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("home.knowledgeHubDesc")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Snake Handlers Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              {t("home.handlers")}
            </CardTitle>
            <p className="text-muted-foreground">{t("home.handlersDesc")}</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mockHandlers.map((handler) => (
                <HandlerCard key={handler.id} {...handler} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;