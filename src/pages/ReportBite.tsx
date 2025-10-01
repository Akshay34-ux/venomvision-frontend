// frontend/src/pages/ReportBite.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

// Leaflet + React-Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// UI
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ✅ Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ RecenterMap component
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, 14);
  return null;
}

export default function ReportBite() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    victimName: "",
    age: "",
    symptoms: "",
    timeOfBite: "",
    location: "",
    gps: "",
  });

  const [coords, setCoords] = useState<[number, number]>([12.9716, 77.5946]); // default Bangalore
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Get current location + auto-move map
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lat, lng]);
        setForm((p) => ({ ...p, gps: `${lat}, ${lng}` }));
      },
      () => alert("⚠️ Unable to fetch location"),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const baseUrl =
        import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
        "http://localhost:5001";
      await axios.post(`${baseUrl}/api/report-bite`, form);
      alert("✅ " + t("reportBite.submit"));
      navigate("/");
    } catch {
      alert("❌ Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Header */}
      <Header
        title={t("reportBite.title")}
        tagline={t("reportBite.tagline")}
        showLanguageToggle={true}
      />

      {/* Form */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle>{t("reportBite.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Input
                  name="victimName"
                  placeholder={t("reportBite.victimName")}
                  value={form.victimName}
                  onChange={handleChange}
                />
                <Input
                  name="age"
                  placeholder={t("reportBite.age")}
                  value={form.age}
                  onChange={handleChange}
                  className="mt-3"
                />
                <Input
                  name="timeOfBite"
                  placeholder={t("reportBite.timeOfBite")}
                  value={form.timeOfBite}
                  onChange={handleChange}
                  className="mt-3"
                />
              </div>

              <div>
                <Input
                  name="symptoms"
                  placeholder={t("reportBite.symptoms")}
                  value={form.symptoms}
                  onChange={handleChange}
                />
                <Input
                  name="location"
                  placeholder={t("reportBite.location")}
                  value={form.location}
                  onChange={handleChange}
                  className="mt-3"
                />
                <div className="flex gap-2 mt-3">
                  <Input
                    name="gps"
                    placeholder={t("reportBite.gps")}
                    value={form.gps}
                    readOnly
                  />
                  <Button onClick={handleGetLocation} variant="outline">
                    📍 {t("reportBite.getLocation")}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground"
            >
              {loading ? t("reportBite.submitting") : t("reportBite.submit")}
            </Button>
          </CardContent>
        </Card>

        {/* ✅ Map preview */}
        <div className="w-full max-w-2xl mt-6">
          <MapContainer
            center={coords}
            zoom={14}
            style={{ height: 300, width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords}>
              <Popup>📍 {t("reportBite.location")}</Popup>
            </Marker>
            <RecenterMap coords={coords} />
          </MapContainer>
        </div>
      </div>

      {/* ✅ Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} VenomVision. {t("landing.footer")}
      </footer>
    </div>
  );
}