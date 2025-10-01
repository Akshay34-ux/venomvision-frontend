// frontend/src/pages/HandlerDashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HandlerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("handlerToken");
      if (!token) return navigate("/handler-login");

      const res = await axios.get(`${baseUrl}/api/handlers/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.handler);
    } catch (err) {
      navigate("/handler-login");
    }
  };

  const logout = () => {
    localStorage.removeItem("handlerToken");
    navigate("/handler-login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <Card className="max-w-2xl mx-auto shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-success">
            🐍 Handler Dashboard
          </CardTitle>
          <p className="text-muted-foreground mt-1">
            Welcome to your VenomVision workspace
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {profile ? (
            <div className="space-y-2 text-gray-700">
              <p><b>Name:</b> {profile.name}</p>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>Phone:</b> {profile.phone}</p>
              <p>
                <b>Status:</b>{" "}
                <Badge variant={profile.status === "approved" ? "success" : "warning"}>
                  {profile.status}
                </Badge>
              </p>

              <Button
                onClick={logout}
                className="w-full mt-6 bg-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">Loading profile...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}