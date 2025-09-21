import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-700 via-emerald-600 to-teal-700 text-white px-6">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 p-4 rounded-2xl shadow-lg">
            <Shield className="h-12 w-12 text-yellow-300" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to VenomVision
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          Instantly identify snakes, report bites, and connect with certified
          handlers. Stay safe, stay informed.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          {/* Get Started → goes to Index */}
          <Button
            size="lg"
            className="bg-white text-green-700 font-semibold hover:bg-gray-100"
            onClick={() => navigate("/index")}
          >
            Get Started
          </Button>

          {/* Register as Handler → goes to signup */}
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-green-700"
            onClick={() => navigate("/handler-signup")}
          >
            Register as Handler
          </Button>
        </div>
      </div>
    </div>
  );
}