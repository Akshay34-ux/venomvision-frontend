// frontend/src/pages/HandlerLogin.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HandlerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const login = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/api/handlers/auth/login`, { email, password });
      if (res.data.success) {
        // save token
        localStorage.setItem("token", res.data.token);
        alert("Login success");
        navigate("/handler-dashboard");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Handler Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2 p-2 border rounded" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mb-4 p-2 border rounded" />
      <button onClick={login} disabled={loading} className="px-4 py-2 bg-primary text-white rounded">
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}