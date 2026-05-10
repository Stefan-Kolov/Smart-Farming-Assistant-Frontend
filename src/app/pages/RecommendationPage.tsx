import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Droplets, Leaf, AlertTriangle, Calendar, Thermometer, CloudRain, Droplet, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { getFarm } from "../api/farms";
import { getCrop } from "../api/crops";
import { getRecommendation, type RecommendationResponse } from "../api/recommendations";
import { geocode } from "../api/weather";

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'SPRING';
  if (m >= 6 && m <= 8) return 'SUMMER';
  if (m >= 9 && m <= 11) return 'AUTUMN';
  return 'WINTER';
};

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'HIGH': return 'bg-destructive text-white';
    case 'MEDIUM': return 'bg-warning text-white';
    case 'LOW': return 'bg-success text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export function RecommendationPage() {
  const { farmId, cropId } = useParams();
  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [farmName, setFarmName] = useState("");
  const [cropName, setCropName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!farmId || !cropId) return;
    loadRecommendation(Number(farmId), Number(cropId));
  }, [farmId, cropId]);

  const loadRecommendation = async (fId: number, cId: number) => {
    try {
      setLoading(true);
      const [farm, crop] = await Promise.all([getFarm(fId), getCrop(cId)]);
      setFarmName(farm.name);
      setCropName(crop.name);

      // Geocode the farm location to get lat/lon
      const geoResults = await geocode({ name: farm.location, count: 1 });
      if (!geoResults.length) throw new Error(`Could not geocode location: ${farm.location}`);
      const { latitude, longitude } = geoResults[0];

      const rec = await getRecommendation({
        lat: latitude,
        lon: longitude,
        crop: crop.name,
        soilType: crop.soilType,
        season: getSeason(),
        farmId: fId,
        cropId: cId,
      });
      setRecommendation(rec);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get recommendation.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-gray-500">Generating AI recommendation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/dashboard/farm/${farmId}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />Back
        </Button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      </div>
    );
  }

  if (!recommendation) return null;

  const isAI = recommendation.source?.toLowerCase().includes('ai') || recommendation.source?.toLowerCase().includes('gemini');
  const riskLevel = (recommendation.recommendation?.toLowerCase().includes('high') ? 'HIGH'
    : recommendation.recommendation?.toLowerCase().includes('low') ? 'LOW'
    : 'MEDIUM') as Priority;

  // Parse recommendation text into sections
  const recText = recommendation.recommendation || '';
  const lines = recText.split('\n').filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/dashboard/farm/${farmId}`)}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Farm
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">AI Recommendation</h2>
          <p className="text-gray-600 mt-2">
            {farmName} • {cropName}
          </p>
        </div>
        <Badge className={getPriorityColor(riskLevel)}>
          {riskLevel} Priority
        </Badge>
      </div>

      {/* AI/Rule-based Banner */}
      {!isAI && (
        <Alert className="bg-warning/10 border-warning">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            Generated without AI — This recommendation is based on rule-based algorithms due to service limitations.
            {recommendation.note && ` ${recommendation.note}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Recommendation */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">Farming Recommendation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">{line}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather at time of recommendation */}
      {recommendation.weather && (
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">Weather Conditions Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className="text-sm font-medium text-gray-900">{recommendation.weather.temperature?.toFixed(1)}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Droplet className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Humidity</p>
                  <p className="text-sm font-medium text-gray-900">{recommendation.weather.humidity?.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CloudRain className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="text-xs text-gray-500">Precipitation</p>
                  <p className="text-sm font-medium text-gray-900">{recommendation.weather.precipitation?.toFixed(1)}mm</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1 bg-primary hover:bg-primary-hover"
          onClick={() => navigate("/dashboard/reports")}
        >
          View All Recommendations
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => window.print()}
        >
          Export as PDF
        </Button>
      </div>
    </div>
  );
}