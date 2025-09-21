import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function HandlerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">Handler Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your handler information and update contact details.
            </p>
            <Button className="mt-4 w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snake Rescue Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View and respond to rescue requests in your assigned area.
            </p>
            <Button className="mt-4 w-full">View Requests</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Button variant="destructive" onClick={() => navigate("/")}>
          Logout
        </Button>
      </div>
    </div>
  );
}