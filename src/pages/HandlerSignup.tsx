// src/pages/HandlerSignup.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HandlerSignup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    specialization: "",
  });
  const [credentials, setCredentials] = useState<{username: string, password: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const username = "handler_" + Math.floor(Math.random() * 10000);
    const password = Math.random().toString(36).slice(-8);
    setCredentials({ username, password });
    // TODO: Save handler + creds to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader>
          <CardTitle>Register as Handler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input name="name" placeholder="Full Name" onChange={handleChange} />
          <Input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <Input name="location" placeholder="Location" onChange={handleChange} />
          <Input name="specialization" placeholder="Specialization" onChange={handleChange} />
          <Button onClick={handleSubmit} className="w-full">Register</Button>

          {credentials && (
            <div className="mt-4 p-3 border rounded bg-muted">
              <p className="font-semibold">Your login credentials:</p>
              <p>Username: <span className="font-mono">{credentials.username}</span></p>
              <p>Password: <span className="font-mono">{credentials.password}</span></p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}