import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function HandlerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    experience: "",
    specialization: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handler registered:", form);

    // TODO: send to backend API
    alert("✅ Handler registered successfully!");
    navigate("/"); // Redirect back home after signup
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Handler Signup" tagline="Join VenomVision as a certified snake handler" />

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Register as a Handler</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91-XXXXXXXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City / Area"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  placeholder="e.g. 5 years"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  placeholder="e.g. Cobra handling, rescue operations"
                  value={form.specialization}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}