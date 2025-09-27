// frontend/src/pages/HandlerSignup.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

      const res = await axios.post(`${baseUrl}/api/handlers/register`, form);

      if (res.data.success) {
        alert("✅ Registration submitted. Waiting for admin approval.");
        navigate("/"); // or redirect to landing
      } else {
        alert("❌ Registration failed.");
      }
    } catch (err: any) {
      console.error(err);
      alert("⚠️ Error submitting registration. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Header
        title={t("handlerSignup.title")}
        tagline={t("handlerSignup.tagline", { defaultValue: "Join VenomVision as a certified handler" })}
        showLanguageToggle={true}
      />

      <Card className="mt-4 shadow-strong max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{t("handlerSignup.title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="name" placeholder={t("handlerSignup.name")} value={form.name} onChange={handleChange} />
            <Input name="email" placeholder={t("handlerSignup.email")} value={form.email} onChange={handleChange} />
            <Input name="phone" placeholder={t("handlerSignup.phone")} value={form.phone} onChange={handleChange} />
            <Input name="experience" placeholder={t("handlerSignup.experience")} value={form.experience} onChange={handleChange} />
            <Input name="specialization" placeholder={t("handlerSignup.specialization")} value={form.specialization} onChange={handleChange} />
            <Input name="location" placeholder={t("handlerSignup.location")} value={form.location} onChange={handleChange} />
            <Input name="gps" placeholder={t("handlerSignup.gps")} value={form.gps} onChange={handleChange} />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-primary-foreground">
            {loading ? "Registering..." : t("handlerSignup.submit")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}