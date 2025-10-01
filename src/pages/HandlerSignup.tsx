// frontend/src/pages/HandlerSignup.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import "leaflet/dist/leaflet.css";

// ✅ Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Component to recenter map when coords change
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

export default function HandlerSignup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    location: "",
    gps: "",
  });

  const [coords, setCoords] = useState<[number, number]>([12.9716, 77.5946]); // default Bangalore
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Get current location + update form + move map
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newCoords: [number, number] = [lat, lng];
        setCoords(newCoords);
        setForm((prev) => ({ ...prev, gps: `${lat}, ${lng}` }));
      },
      () => alert("⚠️ Unable to fetch location. Please enable GPS."),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async () => {
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5001";

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/api/handlers/register`, form);

      if (res.data.success) {
        alert("✅ Registration submitted. Waiting for admin approval.");
        navigate("/");
      } else {
        alert("❌ Registration failed.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      alert("⚠️ Error submitting registration. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Header */}
      <Header
        title={t("handlerSignup.title", "🐍 Join VenomVision")}
        tagline={t("handlerSignup.tagline", "Become a certified snake handler")}
        showLanguageToggle={true}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle>{t("handlerSignup.formTitle", "Register as Snake Handler")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
              <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
              <Input name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} />
              <Input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} />
              <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
              <div className="flex gap-2 col-span-2">
                <Input
                  name="gps"
                  placeholder="GPS Coordinates"
                  value={form.gps}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleGetLocation}>
                  📍 {t("handlerSignup.getLocation", "Get Location")}
                </Button>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? t("handlerSignup.submitting", "Registering...") : t("handlerSignup.submit", "Register")}
            </Button>
          </CardContent>
        </Card>

        {/* ✅ Map Preview */}
        <div className="w-full max-w-2xl mt-6">
          <MapContainer center={coords} zoom={13} style={{ height: 300, width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords}>
              <Popup>📍 {t("handlerSignup.mapPopup", "Your Selected Location")}</Popup>
            </Marker>
            {/* ✅ Automatically recenters map */}
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