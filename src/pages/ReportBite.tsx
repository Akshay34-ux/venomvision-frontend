// frontend/src/pages/ReportBite.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// i18n
import { useTranslation } from "react-i18next";

// Leaflet + React-Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// GeoSearch
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// UI components
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// --- SearchControl ---
function SearchControl({
  setCoords,
  setForm,
}: {
  setCoords: (c: [number, number]) => void;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const control = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      marker: { icon: new L.Icon.Default(), draggable: false },
      autoClose: true,
      keepResult: true,
    });

    map.addControl(control as any);

    setTimeout(() => {
      const el = document.querySelector(".leaflet-control-geosearch") as HTMLElement | null;
      if (el) {
        el.style.background = "var(--card)";
        el.style.border = "1px solid rgba(0,0,0,0.06)";
        el.style.borderRadius = "10px";
        el.style.padding = "6px";
        el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        const input = el.querySelector("input");
        if (input instanceof HTMLInputElement) {
          input.style.border = "none";
          input.style.outline = "none";
          input.style.background = "transparent";
          input.style.padding = "6px 8px";
          input.style.width = "260px";
        }
      }
    }, 300);

    const onShowLocation = (result: any) => {
      const loc = result?.location ?? result;
      if (!loc) return;
      const lat = loc.y ?? loc.lat;
      const lng = loc.x ?? loc.lng ?? loc.lon;
      if (typeof lat === "number" && typeof lng === "number") {
        setCoords([lat, lng]);
        setForm((p: any) => ({
          ...p,
          gps: `${lat}, ${lng}`,
          location: loc.label ?? loc.name ?? p.location,
        }));
        map.setView([lat, lng], 14);
      }
    };

    (map as any).on("geosearch/showlocation", onShowLocation);

    return () => {
      (map as any).removeControl(control);
      (map as any).off("geosearch/showlocation", onShowLocation);
    };
  }, [map, setCoords, setForm]);

  return null;
}

// --- Main ---
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

  const [coords, setCoords] = useState<[number, number]>([12.9716, 77.5946]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      await axios.post(`${baseUrl}/api/report-bite`, form);
      alert("✅ " + t("reportBite.submitted"));
      navigate("/");
    } catch {
      alert("❌ " + t("reportBite.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Header title={t("reportBite.title")} tagline={t("reportBite.tagline")} />

      <Card className="mt-4 shadow-strong">
        <CardHeader>
          <CardTitle>{t("reportBite.title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input name="victimName" placeholder={t("reportBite.victimName")} value={form.victimName} onChange={handleChange} />
              <Input name="age" placeholder={t("reportBite.age")} value={form.age} onChange={handleChange} className="mt-3" />
              <Input name="timeOfBite" placeholder={t("reportBite.timeOfBite")} value={form.timeOfBite} onChange={handleChange} className="mt-3" />
            </div>

            <div>
              <Input name="symptoms" placeholder={t("reportBite.symptoms")} value={form.symptoms} onChange={handleChange} />
              <Input name="location" placeholder={t("reportBite.location")} value={form.location} onChange={handleChange} className="mt-3" />
              <div className="flex gap-2 mt-3">
                <Input name="gps" placeholder={t("reportBite.gps")} value={form.gps} readOnly />
                <Button onClick={handleGetLocation} variant="outline">
                  {t("reportBite.getLocation")}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-primary-foreground">
            {loading ? t("reportBite.submitting") : t("reportBite.submit")}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 rounded-lg overflow-hidden shadow-soft">
        <MapContainer center={coords} zoom={14} style={{ height: 420, width: "100%" }}>
          <SearchControl setCoords={setCoords} setForm={setForm} />
          <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={coords}>
            <Popup>📍 {t("reportBite.location")}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}