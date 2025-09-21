// frontend/src/pages/HandlerSignup.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// UI
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function HandlerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    experience: "",
    specialization: "",
    location: "",
    gps: "",
  });

  const [coords, setCoords] = useState<[number, number]>([12.9716, 77.5946]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("experience", form.experience);
      formData.append("specialization", form.specialization);
      formData.append("location", form.location);
      formData.append("gps", form.gps);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      await axios.post(`${baseUrl}/api/handler-signup`, formData);

      alert("✅ Handler registered successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Header title="Handler Registration" tagline="Join VenomVision as a certified handler" />

      <Card className="mt-4 shadow-strong max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Register as Snake Handler</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              name="experience"
              placeholder="Experience (e.g. 10 years)"
              value={form.experience}
              onChange={handleChange}
            />
            <Input
              name="specialization"
              placeholder="Specialization (e.g. Cobra rescue)"
              value={form.specialization}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Input
              name="location"
              placeholder="Location Description"
              value={form.location}
              onChange={handleChange}
            />
            <div className="flex gap-2">
              <Input name="gps" placeholder="GPS Coordinates" value={form.gps} readOnly />
              <Button onClick={handleGetLocation} variant="outline">
                📍 Get Location
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <label className="font-medium">Upload Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>

      {/* Map */}
      <div className="mt-6 rounded-lg overflow-hidden shadow-soft max-w-3xl mx-auto">
        <MapContainer
          center={coords}
          zoom={14}
          style={{ height: 400, width: "100%" }}
        >
          <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />
          <Marker position={coords}>
            <Popup>📍 Selected Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}