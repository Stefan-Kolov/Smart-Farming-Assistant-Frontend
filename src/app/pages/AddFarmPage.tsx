import React, { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function AddFarmPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Mock save - navigate back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/dashboard")}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>Add New Farm</CardTitle>
          <CardDescription>Enter the details of your new agricultural site</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="farm-name">Farm Name *</Label>
              <Input
                id="farm-name"
                type="text"
                placeholder="e.g., Green Valley Farm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., California, USA or GPS coordinates"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="bg-input-background"
              />
              <p className="text-sm text-gray-500">
                Enter city/state or GPS coordinates for weather tracking
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary-hover"
              >
                Save Farm
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
