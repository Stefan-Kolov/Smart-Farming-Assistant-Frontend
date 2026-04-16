import React from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Droplets, Leaf, AlertTriangle, Calendar, Thermometer, CloudRain, Droplet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { mockRecommendations } from "../data/mockData";

export function RecommendationPage() {
  const { recommendationId } = useParams();
  const navigate = useNavigate();

  const recommendation = mockRecommendations.find((r) => r.id === recommendationId);

  if (!recommendation) {
    return <div>Recommendation not found</div>;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-destructive text-white';
      case 'Medium':
        return 'bg-warning text-white';
      case 'Low':
        return 'bg-success text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/dashboard")}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">AI Recommendation</h2>
          <p className="text-gray-600 mt-2">
            {recommendation.farmName} • {recommendation.cropName}
          </p>
        </div>
        <Badge className={getPriorityColor(recommendation.priority)}>
          {recommendation.priority} Priority
        </Badge>
      </div>

      {/* AI/Rule-based Banner */}
      {!recommendation.isAI && (
        <Alert className="bg-warning/10 border-warning">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            Generated without AI - This recommendation is based on rule-based algorithms due to service limitations.
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Irrigation Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Irrigation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {recommendation.irrigation}
            </p>
          </CardContent>
        </Card>

        {/* Fertilization Card */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Fertilization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {recommendation.fertilization}
            </p>
          </CardContent>
        </Card>

        {/* Risk Alert Card */}
        <Card className={`border-${recommendation.priority === 'High' ? 'red' : 'amber'}-200 bg-${recommendation.priority === 'High' ? 'red' : 'amber'}-50/50`}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-full ${recommendation.priority === 'High' ? 'bg-destructive' : 'bg-warning'} flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">Risk Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {recommendation.riskAlert}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metadata Bar */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Recommendation Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Generated On</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(recommendation.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="text-sm font-medium text-gray-900">
                  {recommendation.weather.temperature}°C
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Droplet className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-sm font-medium text-gray-900">
                  {recommendation.weather.humidity}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-sky-500" />
              <div>
                <p className="text-xs text-gray-500">Rainfall</p>
                <p className="text-sm font-medium text-gray-900">
                  {recommendation.weather.rainfall}mm
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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