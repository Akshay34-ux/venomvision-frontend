import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function HandlerSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    gps: "",
    experience: "",
    specialization: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setForm((prev) => ({ ...prev, gps: `${lat}, ${lng}` }));
        toast({ title: "📍 Location Captured", description: `Lat: ${lat}, Lng: ${lng}` });
      },
      () => alert("⚠️ Unable to fetch location"),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "✅ Registration Submitted",
        description: "Our team will verify your details and approve your profile.",
      });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Handler Registration" tagline="Join our mission to save lives" />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Register as a Snake Handler</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              <Input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
              <Input type="email" name="email" placeholder="Email (optional)" value={form.email} onChange={handleChange} />
              <Input name="location" placeholder="Location (City/District)" value={form.location} onChange={handleChange} />

              {/* GPS Section */}
              <div className="flex gap-2">
                <Input name="gps" placeholder="GPS Coordinates" value={form.gps} readOnly />
                <Button type="button" onClick={handleGetLocation} variant="outline">
                  📍 Get Location
                </Button>
              </div>

              <Input type="number" name="experience" placeholder="Years of Experience" value={form.experience} onChange={handleChange} required />

              <Select onValueChange={(val) => setForm({ ...form, specialization: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cobra">Cobra Specialist</SelectItem>
                  <SelectItem value="viper">Viper Specialist</SelectItem>
                  <SelectItem value="non-venomous">Non-venomous</SelectItem>
                  <SelectItem value="all">All Species</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => setForm({ ...form, status: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="on-call">On Call</SelectItem>
                </SelectContent>
              </Select>

              <Input type="file" accept="image/*,.pdf" required />

              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={loading}>
                {loading ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}