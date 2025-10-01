// frontend/src/pages/SetPasswordPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// UI components
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (password.length < 6) return alert("Password must be at least 6 characters.");
    if (password !== confirm) return alert("Passwords do not match.");
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await axios.post(
        `${baseUrl}/api/handlers/auth/set-password/${token}`,
        { password }
      );
      if (res.data.success) {
        alert("✅ Password set. Please login.");
        navigate("/handler-login");
      } else {
        alert("❌ " + (res.data.message || "Failed"));
      }
    } catch (err: any) {
      console.error("Set password error:", err);
      alert(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ✅ Header */}
      <Header
        title="🔒 Secure Your Account"
        tagline="Set your password to start using VenomVision"
        showLanguageToggle={false}
      />

      {/* ✅ Form Section */}
      <div className="flex-1 flex justify-center items-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              Set Your Password
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <Button
              onClick={submit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground"
            >
              {loading ? "Setting..." : "Set Password"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} VenomVision. All rights reserved.
      </footer>
    </div>
  );
}