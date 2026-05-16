import React, { type FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { getCrop, updateCrop, type SoilType } from "../api/crops";

export function EditCropPage() {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const [farmId, setFarmId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [soilType, setSoilType] = useState<SoilType | "">("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!cropId) return;
    getCrop(Number(cropId))
      .then((crop) => {
        setName(crop.name);
        // Normalize ISO date to YYYY-MM-DD for the date input
        setPlantingDate(crop.plantingDate.substring(0, 10));
        setSoilType(crop.soilType);
        setFarmId(crop.farmId);
      })
      .catch(() => setError("Failed to load crop details."))
      .finally(() => setFetchLoading(false));
  }, [cropId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!soilType) { setError("Please select a soil type."); return; }
    setError("");
    setLoading(true);
    try {
      await updateCrop(Number(cropId), {
        name,
        plantingDate,
        soilType: soilType as SoilType,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/farm/${farmId}`), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update crop.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
        Back to Farm
      </Button>

      <Card className="border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>Edit Crop</CardTitle>
          <CardDescription>Update the details for this crop</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Crop updated successfully! Redirecting...
              </div>
            )}

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
              <Select value={soilType} onValueChange={(v) => setSoilType(v as SoilType)}>
                <SelectTrigger id="soil-type" className="bg-input-background">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLAY">Clay</SelectItem>
                  <SelectItem value="SANDY">Sandy</SelectItem>
                  <SelectItem value="LOAMY">Loamy</SelectItem>
                  <SelectItem value="SILTY">Silty</SelectItem>
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
                disabled={loading || success}
              >
                {loading ? "Saving..." : "Save Changes"}
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
