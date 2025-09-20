// frontend/src/pages/ReportBite.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Leaflet + React-Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function ReportBite() {
  const navigate = useNavigate();

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
          setForm({ ...form, gps: `${lat}, ${lng}` });
          alert(`📍 Location captured: ${lat}, ${lng}`);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // fallback for dev
          const lat = 12.9716;
          const lng = 77.5946;
          setCoords([lat, lng]);
          setForm({ ...form, gps: `${lat}, ${lng}` });
          alert("⚠️ Using fallback location: Bangalore");
        }
      );
    } else {
      alert("❌ Geolocation not supported on this browser");
    }
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5001/api/report-bite", form);
      alert("✅ Report submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("❌ Error submitting report:", err);
      alert("❌ Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Header title="Report Snake Bite" tagline="Help us save lives" />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Victim Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            name="victimName"
            placeholder="Victim Name"
            value={form.victimName}
            onChange={handleChange}
          />
          <Input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />
          <Input
            name="symptoms"
            placeholder="Symptoms"
            value={form.symptoms}
            onChange={handleChange}
          />
          <Input
            name="timeOfBite"
            placeholder="Time of Bite"
            value={form.timeOfBite}
            onChange={handleChange}
          />
          <Input
            name="location"
            placeholder="Location Description"
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </CardContent>
      </Card>

      {/* Show map if coords are available */}
      {coords && (
        <div className="mt-6">
          <MapContainer
            center={coords}
            zoom={14}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords}>
              <Popup>📍 Snake Bite Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}