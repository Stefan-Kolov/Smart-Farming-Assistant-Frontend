import React, { type FormEvent, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { mockFarms } from "../data/mockData";

export function AddCropPage() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [soilType, setSoilType] = useState("");

  const farm = mockFarms.find((f) => f.id === farmId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Mock save - navigate back to farm details
    navigate(`/dashboard/farm/${farmId}`);
  };

  if (!farm) {
    return <div>Farm not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/dashboard/farm/${farmId}`)}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {farm.name}
      </Button>

      <Card className="border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>Add New Crop</CardTitle>
          <CardDescription>Enter the details for a new crop on {farm.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="crop-name">Crop Name *</Label>
              <Input
                id="crop-name"
                type="text"
                placeholder="e.g., Wheat, Corn, Tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planting-date">Planting Date *</Label>
              <div className="relative">
                <Input
                  id="planting-date"
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  required
                  className="bg-input-background"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soil-type">Soil Type *</Label>
              <Select value={soilType} onValueChange={setSoilType} required>
                <SelectTrigger id="soil-type" className="bg-input-background">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                  <SelectItem value="clay-loam">Clay Loam</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="peaty">Peaty</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Soil type affects irrigation and fertilization recommendations
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary-hover"
              >
                Save Crop
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/dashboard/farm/${farmId}`)}
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
