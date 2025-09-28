// frontend/src/pages/SetPasswordPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
      const res = await axios.post(`${baseUrl}/api/handlers/auth/set-password/${token}`, { password });
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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Set your password</h2>
      <input
        type="password"
        className="block w-full mb-2 p-2 border rounded"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="block w-full mb-4 p-2 border rounded"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button onClick={submit} disabled={loading} className="px-4 py-2 bg-primary text-white rounded">
        {loading ? "Setting..." : "Set Password"}
      </button>
    </div>
  );
}