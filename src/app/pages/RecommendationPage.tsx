import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft, Leaf, AlertTriangle, Thermometer, CloudRain, Droplet,
  Loader2, Droplets, Sprout, ShieldAlert,
} from "lucide-react";
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

/** Split raw recommendation text (newline or pipe separated) into irrigation, fertilization, and risk lines */
function parseRecommendationSections(text: string) {
  // Handle both AI (newlines) and rule-based (pipes) output formats
  const lines = text.split(/\n|\|/).map((l) => l.trim()).filter(Boolean);

  const irrigation: string[] = [];
  const fertilization: string[] = [];
  const risks: string[] = [];
  const general: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/irrigat|watering|water\b|moisture|rainfall|precipit|flood|drought|drip|sprinkler/.test(lower)) {
      irrigation.push(line);
    } else if (/fertil|nutrient|nitrogen|phosphor|potassium|npk|compost|organic|soil amendment|manure|supplement/.test(lower)) {
      fertilization.push(line);
    } else if (/risk|disease|pest|fungal|blight|mildew|infestation|aphid|frost|heat stress|danger|warning|caution|monitor|protect|severe|critical/.test(lower)) {
      risks.push(line);
    } else {
      general.push(line);
    }
  }

  return { irrigation, fertilization, risks, general };
}

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

  const recText = recommendation.recommendation || '';
  const { irrigation, fertilization, risks, general } = parseRecommendationSections(recText);

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

      {/* General / Overview card */}
      {general.length > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">General Farming Advice</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {general.map((line, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3 Specialty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Irrigation – Blue */}
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-base text-blue-800">Irrigation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {irrigation.length > 0 ? (
              <ul className="space-y-2">
                {irrigation.map((line, i) => (
                  <li key={i} className="text-sm text-blue-900 leading-relaxed flex gap-2">
                    <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-blue-700/60 italic">No specific irrigation adjustments needed.</p>
            )}
          </CardContent>
        </Card>

        {/* Fertilization – Amber/Brown */}
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-base text-amber-800">Fertilization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {fertilization.length > 0 ? (
              <ul className="space-y-2">
                {fertilization.map((line, i) => (
                  <li key={i} className="text-sm text-amber-900 leading-relaxed flex gap-2">
                    <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-amber-700/60 italic">No specific fertilization changes recommended.</p>
            )}
          </CardContent>
        </Card>

        {/* Risks – Red */}
        <Card className="border-red-200 bg-red-50/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-base text-red-800">Risks & Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {risks.length > 0 ? (
              <ul className="space-y-2">
                {risks.map((line, i) => (
                  <li key={i} className="text-sm text-red-900 leading-relaxed flex gap-2">
                    <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-700/60 italic">No significant risks detected.</p>
            )}
          </CardContent>
        </Card>
      </div>

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