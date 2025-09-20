// frontend/src/pages/ReportBite.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Leaflet + React-Leaflet
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

// GeoSearch
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

// UI components (adjust paths as in your project)
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Fix default marker icons for Leaflet (important for many bundlers)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// --- SearchControl component: adds the geosearch control using useMap() ---
function SearchControl({
  setCoords,
  setForm,
}: {
  setCoords: (c: [number, number]) => void;
  setForm: React.Dispatch<React.SetStateAction<any>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const provider = new OpenStreetMapProvider();
    const control = new GeoSearchControl({
      provider,
      style: "bar", // 'bar' or 'button' — bar gives a nice input
      showMarker: true,
      showPopup: false,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      autoClose: true,
      keepResult: true,
    });

    // Add control to map
    map.addControl(control as any);

    // Style tweak: apply small theme-friendly overrides to the control container
    setTimeout(() => {
      const el = document.querySelector(".leaflet-control-geosearch") as HTMLElement | null;
      if (el) {
        // Example inline tweaks (you can move into CSS if you prefer)
        el.style.background = "var(--card)";
        el.style.border = "1px solid rgba(0,0,0,0.06)";
        el.style.borderRadius = "10px";
        el.style.padding = "6px";
        el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        // tweak the input inside if present
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

    // Listen for the geosearch result event
    const onShowLocation = (result: any) => {
      // typical shape: result.location = { x: lng, y: lat, label: '...' }
      const loc = result?.location ?? result;
      if (!loc) return;
      const lat = loc.y ?? loc.lat ?? null;
      const lng = loc.x ?? loc.lng ?? loc.lon ?? null;
      const label = loc.label ?? loc.name ?? "";

      if (typeof lat === "number" && typeof lng === "number") {
        const coords: [number, number] = [lat, lng];
        setCoords(coords);
        setForm((prev: any) => ({ ...prev, gps: `${lat}, ${lng}`, location: label || prev.location }));
        // center map on chosen location
        try {
          map.setView(coords, 14);
        } catch (e) {
          // ignore
        }
      }
    };

    // `geosearch/showlocation` is the event emitted by the control
    (map as any).on("geosearch/showlocation", onShowLocation);

    // cleanup
    return () => {
      try {
        (map as any).removeControl(control);
        (map as any).off("geosearch/showlocation", onShowLocation);
      } catch (e) {
        // ignore errors during cleanup
      }
    };
  }, [map, setCoords, setForm]);

  return null;
}

// --- Main page ---
export default function ReportBite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    victimName: "",
    age: "",
    symptoms: "",
    timeOfBite: "",
    location: "",
    gps: "",
  });

  // default to Bangalore lat/lng — user will update with search or Get Location
  const [coords, setCoords] = useState<[number, number]>([12.9716, 77.5946]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lat, lng]);
        setForm((p) => ({ ...p, gps: `${lat}, ${lng}` }));
        alert(`Location captured: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to fetch location; using fallback coordinates.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      await axios.post(`${baseUrl}/api/report-bite`, form);
      alert("Report submitted — thank you.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Header title="Report Snake Bite" tagline="Help us save lives" />

      <Card className="mt-4 shadow-strong">
        <CardHeader>
          <CardTitle>Victim Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input name="victimName" placeholder="Victim Name" value={form.victimName} onChange={handleChange} />
              <Input name="age" placeholder="Age" value={form.age} onChange={handleChange} className="mt-3" />
              <Input name="timeOfBite" placeholder="Time of Bite" value={form.timeOfBite} onChange={handleChange} className="mt-3" />
            </div>

            <div>
              <Input name="symptoms" placeholder="Symptoms" value={form.symptoms} onChange={handleChange} />
              <Input name="location" placeholder="Location Description" value={form.location} onChange={handleChange} className="mt-3" />
              <div className="flex gap-2 mt-3">
                <Input name="gps" placeholder="GPS Coordinates" value={form.gps} readOnly />
                <Button onClick={handleGetLocation} variant="outline">📍 Get Location</Button>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-primary-foreground">
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </CardContent>
      </Card>

      {/* Map area */}
      <div className="mt-6 rounded-lg overflow-hidden shadow-soft">
        <MapContainer center={coords} zoom={14} style={{ height: 420, width: "100%" }}>
          {/* Add the search control as a child component that uses the map via useMap */}
          <SearchControl setCoords={setCoords} setForm={setForm} />

          <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={coords}>
            <Popup>📍 Snake Bite Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}