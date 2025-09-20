// frontend/src/pages/ReportBite.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Leaflet + React-Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

// UI components
import { Header } from "../components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Draggable marker component
function DraggableMarker({
  coords,
  setCoords,
  setForm,
}: {
  coords: [number, number];
  setCoords: (coords: [number, number]) => void;
  setForm: React.Dispatch<
    React.SetStateAction<{
      victimName: string;
      age: string;
      symptoms: string;
      timeOfBite: string;
      location: string;
      gps: string;
    }>
  >;
}) {
  const [position, setPosition] = useState(coords);

  const eventHandlers = {
    dragend(e: any) {
      const marker = e.target;
      const newPos = marker.getLatLng();
      const lat = newPos.lat;
      const lng = newPos.lng;
      setPosition([lat, lng]);
      setCoords([lat, lng]);
      setForm((prev) => ({ ...prev, gps: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
    >
      <Popup>📍 Drag me to adjust exact location</Popup>
    </Marker>
  );
}

export default function ReportBite() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({
    victimName: "",
    age: "",
    symptoms: "",
    timeOfBite: "",
    location: "",
    gps: "",
  });

  // Coordinates
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Capture GPS
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords([lat, lng]);
          setForm({ ...form, gps: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          toast({
            title: "📍 Location Captured",
            description: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          });
        },
        () => {
          const lat = 12.9716;
          const lng = 77.5946;
          setCoords([lat, lng]);
          setForm({ ...form, gps: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          toast({
            title: "⚠️ Fallback Location Used",
            description: "Bangalore coordinates applied.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "❌ Geolocation Not Supported",
        description: "Enable GPS or try another browser.",
        variant: "destructive",
      });
    }
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      await axios.post(`${baseUrl}/api/report-bite`, form);

      toast({
        title: "✅ Report Submitted",
        description: "Snake bite report sent successfully!",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      toast({
        title: "❌ Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header title="Report Snake Bite" tagline="Help us save lives" />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card className="shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-destructive">
              🚨 Emergency Snake Bite Report
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Provide details to alert hospitals and snake handlers nearby.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="victimName"
              placeholder="Victim Name"
              value={form.victimName}
              onChange={handleChange}
            />
            <Input
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
            <Input
              name="symptoms"
              placeholder="Symptoms (e.g., swelling, dizziness)"
              value={form.symptoms}
              onChange={handleChange}
            />
            <Input
              name="timeOfBite"
              placeholder="Time of Bite (e.g., 10:30 AM)"
              value={form.timeOfBite}
              onChange={handleChange}
            />
            <Input
              name="location"
              placeholder="Location Description (e.g., Near park, village road)"
              value={form.location}
              onChange={handleChange}
            />
            <div className="flex gap-2">
              <Input
                name="gps"
                placeholder="GPS Coordinates"
                value={form.gps}
                readOnly
              />
              <Button onClick={handleGetLocation} variant="outline">
                📍 Get Location
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-12 text-lg bg-gradient-primary"
            >
              {loading ? "Submitting..." : "🚨 Submit Report"}
            </Button>
          </CardContent>
        </Card>

        {/* Map */}
        {coords && (
          <div className="mt-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Adjust Location on Map</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Drag the marker if GPS is not accurate.
                </p>
              </CardHeader>
              <CardContent>
                <MapContainer
                  center={coords}
                  zoom={15}
                  className="rounded-xl shadow-strong border"
                  style={{ height: "320px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <DraggableMarker coords={coords} setCoords={setCoords} setForm={setForm} />
                </MapContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}