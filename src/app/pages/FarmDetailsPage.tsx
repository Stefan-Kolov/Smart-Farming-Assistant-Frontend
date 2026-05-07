import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus, Thermometer, Droplets, CloudRain, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { getFarm, deleteFarm, type FarmDto } from "../api/farms";
import { listCropsByFarm, deleteCrop, type CropDto } from "../api/crops";
import { getCurrentWeather } from "../api/weather";

export function FarmDetailsPage() {
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState<FarmDto | null>(null);
  const [crops, setCrops] = useState<CropDto[]>([]);
  const [weather, setWeather] = useState<{ temperature: number; humidity: number; rainfall: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!farmId) return;
    loadFarmData(Number(farmId));
  }, [farmId]);

  const loadFarmData = async (id: number) => {
    try {
      setLoading(true);
      const [farmData, cropData] = await Promise.all([
        getFarm(id),
        listCropsByFarm(id),
      ]);
      setFarm(farmData);
      setCrops(cropData);

      try {
        const w = await getCurrentWeather({ locationName: farmData.location });
        setWeather({
          temperature: Math.round(w.temperature2m),
          humidity: Math.round(w.relativeHumidity2m),
          rainfall: Math.round(w.precipitation),
        });
      } catch {
        // Weather not critical
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load farm.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFarm = async () => {
    if (!farm || !window.confirm(`Delete "${farm.name}"? This cannot be undone.`)) return;
    try {
      await deleteFarm(farm.id);
      navigate("/dashboard");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete farm.");
    }
  };

  const handleDeleteCrop = async (cropId: number, cropName: string) => {
    if (!window.confirm(`Delete crop "${cropName}"?`)) return;
    try {
      await deleteCrop(cropId);
      setCrops((prev) => prev.filter((c) => c.id !== cropId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete crop.");
    }
  };

  const handleGetRecommendation = (crop: CropDto) => {
    navigate(`/dashboard/recommend/${farm!.id}/${crop.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !farm) {
    return <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">{error || "Farm not found"}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Farm Info Card */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{farm.name}</CardTitle>
              <CardDescription className="text-base mt-2">{farm.location}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/edit-farm/${farm.id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Farm
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleDeleteFarm}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {weather ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-2xl font-semibold text-gray-900">{weather.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-2xl font-semibold text-gray-900">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                  <CloudRain className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rainfall</p>
                  <p className="text-2xl font-semibold text-gray-900">{weather.rainfall}mm</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">Weather data unavailable for this location.</p>
          )}
        </CardContent>
      </Card>

      {/* Crops Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Crops</CardTitle>
              <CardDescription>Manage crops planted on this farm</CardDescription>
            </div>
            <Button
              onClick={() => navigate(`/dashboard/add-crop/${farm.id}`)}
              className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Crop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {crops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No crops added yet</p>
              <Button
                onClick={() => navigate(`/dashboard/add-crop/${farm.id}`)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Crop
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop Name</TableHead>
                    <TableHead>Planting Date</TableHead>
                    <TableHead>Soil Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crops.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">{crop.name}</TableCell>
                      <TableCell>{new Date(crop.plantingDate).toLocaleDateString()}</TableCell>
                      <TableCell>{crop.soilType}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGetRecommendation(crop)}
                          >
                            Get AI Recommendation
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCrop(crop.id, crop.name)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}