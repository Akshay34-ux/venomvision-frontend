// frontend/src/pages/HandlerLogin.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HandlerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await axios.post(`${baseUrl}/api/handlers/auth/login`, form);

      if (res.data.success) {
        localStorage.setItem("handlerToken", res.data.token);
        navigate("/handler-dashboard");
      } else {
        alert("❌ Invalid credentials");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            🐍 VenomVision Handler Login
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Secure access for certified snake handlers
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="p-3"
          />
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="p-3"
          />

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 text-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}