// frontend/src/pages/HandlerLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HandlerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) return alert("⚠️ Fill all fields");

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/api/handlers/auth/login`, form);

      if (res.data.success && res.data.token) {
        localStorage.setItem("handlerToken", res.data.token);
        navigate("/handler-dashboard");
      } else {
        alert("❌ " + (res.data.message || "Login failed"));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            🐍 Handler Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}