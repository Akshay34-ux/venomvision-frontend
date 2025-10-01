import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function HandlerDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // ✅ Fetch handler profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("handlerToken");
        if (!token) {
          navigate("/handler-login"); // redirect if not logged in
          return;
        }

        const res = await axios.get(`${baseUrl}/api/handlers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setProfile(res.data.handler);
        } else {
          alert("❌ Failed to load profile");
          navigate("/handler-login");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        navigate("/handler-login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, baseUrl]);

  const logout = () => {
    localStorage.removeItem("handlerToken");
    navigate("/handler-login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">🐍 VenomVision</h2>
        <nav className="space-y-3 flex-1">
          <button
            onClick={() => navigate("/handler-dashboard")}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/report-bite")}
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800"
          >
            Report Bite
          </button>
        </nav>
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 w-full mt-4"
        >
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Card className="max-w-2xl mx-auto shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Handler Dashboard
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Welcome to your VenomVision workspace
            </p>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-gray-500">Loading profile...</p>
            ) : profile ? (
              <div className="space-y-4 text-gray-700">
                <p>
                  <b>Name:</b> {profile.name}
                </p>
                <p>
                  <b>Email:</b> {profile.email}
                </p>
                <p>
                  <b>Phone:</b> {profile.phone}
                </p>
                <p>
                  <b>Specialization:</b> {profile.specialization || "N/A"}
                </p>
                <p>
                  <b>Experience:</b> {profile.experience || "N/A"}
                </p>
                <p>
                  <b>Status:</b>{" "}
                  <Badge
                    variant={
                      profile.status === "approved"
                        ? "success"
                        : profile.status === "pending"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {profile.status}
                  </Badge>
                </p>
              </div>
            ) : (
              <p className="text-red-500">❌ Failed to load profile</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}