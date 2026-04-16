import React from "react";
import { useNavigate } from "react-router";
import { Plus, Thermometer, Droplets, CloudRain, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { mockFarms, mockWeatherTrends } from "../data/mockData";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Weather Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Trends (Last 7 Days)</CardTitle>
          <CardDescription>Temperature and humidity patterns across all farms</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart 
                data={mockWeatherTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Farms Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Your Farms</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all your agricultural sites</p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/add-farm")}
          className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Farm
        </Button>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockFarms.map((farm, index) => (
          <motion.div
            key={farm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              onClick={() => navigate(`/dashboard/farm/${farm.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{farm.name}</CardTitle>
                    <CardDescription className="mt-1">{farm.location}</CardDescription>
                  </div>
                  {farm.weather.temperature > 30 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Alert
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weather Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Thermometer className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Temp</p>
                      <p className="text-sm font-semibold text-gray-900">{farm.weather.temperature}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Humidity</p>
                      <p className="text-sm font-semibold text-gray-900">{farm.weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                      <CloudRain className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rain</p>
                      <p className="text-sm font-semibold text-gray-900">{farm.weather.rainfall}mm</p>
                    </div>
                  </div>
                </div>

                {/* Latest Recommendation */}
                {farm.lastRecommendation && (
                  <div className="p-3 bg-accent rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {farm.lastRecommendation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/recommendation/1`);
                  }}
                >
                  Get AI Recommendation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}