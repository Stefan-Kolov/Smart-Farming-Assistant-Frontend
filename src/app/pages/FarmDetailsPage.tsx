import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus, Thermometer, Droplets, CloudRain, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { mockFarms, mockCrops } from "../data/mockData";

export function FarmDetailsPage() {
  const { farmId } = useParams();
  const navigate = useNavigate();

  const farm = mockFarms.find((f) => f.id === farmId);
  const farmCrops = mockCrops.filter((c) => c.farmId === farmId);

  if (!farm) {
    return <div>Farm not found</div>;
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
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Farm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-2xl font-semibold text-gray-900">{farm.weather.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-2xl font-semibold text-gray-900">{farm.weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                <CloudRain className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rainfall</p>
                <p className="text-2xl font-semibold text-gray-900">{farm.weather.rainfall}mm</p>
              </div>
            </div>
          </div>
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
              onClick={() => navigate(`/dashboard/add-crop/${farmId}`)}
              className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Crop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {farmCrops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No crops added yet</p>
              <Button 
                onClick={() => navigate(`/dashboard/add-crop/${farmId}`)}
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
                  {farmCrops.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">{crop.name}</TableCell>
                      <TableCell>{new Date(crop.plantingDate).toLocaleDateString()}</TableCell>
                      <TableCell>{crop.soilType}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/dashboard/recommendation/1`)}
                          >
                            Get AI Recommendation
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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