// frontend/src/pages/HandlerSignup.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HandlerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    location: "",
    gps: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5001";

    if (!baseUrl) {
      alert("❌ Backend server not configured. Please set VITE_API_URL.");
      return;
    }

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
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Register as Snake Handler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <Input name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} />
            <Input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} />
            <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
            <Input name="gps" placeholder="GPS" value={form.gps} onChange={handleChange} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}