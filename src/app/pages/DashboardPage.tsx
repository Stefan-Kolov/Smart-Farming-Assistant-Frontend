import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Thermometer, Droplets, CloudRain, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { listFarms, type FarmDto } from "../api/farms";
import { getCurrentWeather, getFarmWeatherRecords, type WeatherRecord } from "../api/weather";

interface FarmWithWeather extends FarmDto {
  weather: { temperature: number; humidity: number; rainfall: number } | null;
  lastRecommendation?: string;
}

const FARM_COLORS = [
  "#16a34a",
  "#0ea5e9",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#eab308",
  "#14b8a6",
  "#ef4444",
  "#2563eb",
  "#4d7c0f",
  "#db2777",
  "#7c2d12",
  "#059669",
  "#6366f1",
  "#b45309", 
  "#0284c7"
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<FarmWithWeather[]>([]);
  const [chartData, setChartData] = useState<Record<string, number | string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const farmList = await listFarms();
      const enriched = await Promise.all(
          farmList.map(async (farm): Promise<FarmWithWeather> => {
            try {
              const weather = await getCurrentWeather({ locationName: farm.location });
              return {
                ...farm,
                weather: {
                  temperature: Math.round(weather.temperature2m),
                  humidity: Math.round(weather.relativeHumidity2m),
                  rainfall: Math.round(weather.precipitation),
                },
              };
            } catch {
              return { ...farm, weather: null };
            }
          })
      );
      setFarms(enriched);

      const dateMap: Record<string, Record<string, number>> = {};

      await Promise.all(
          farmList.map(async (farm) => {
            try {
              let records: WeatherRecord[] = await getFarmWeatherRecords(farm.id);

              if (!records || records.length === 0) {
                const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(farm.location)}&count=1&language=en&format=json`;
                const geoRes = await fetch(geocodeUrl);
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                  console.error(`Не се пронајдени координати за локацијата: ${farm.location}`);
                  return;
                }

                const { latitude: lat, longitude: lon } = geoData.results[0];
                const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m&past_days=7&forecast_days=0`;
                const res = await fetch(openMeteoUrl);
                const openMeteoData = await res.json();

                if (openMeteoData.hourly) {
                  openMeteoData.hourly.time.forEach((timeStr: string, idx: number) => {
                    if (timeStr.includes("T12:00")) {
                      const dateObj = new Date(timeStr);
                      const formattedDate = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      if (!dateMap[formattedDate]) dateMap[formattedDate] = {};

                      dateMap[formattedDate][`temp_${farm.id}`] = Math.round(openMeteoData.hourly.temperature_2m[idx]);
                      dateMap[formattedDate][`humidity_${farm.id}`] = Math.round(openMeteoData.hourly.relative_humidity_2m[idx]);
                    }
                  });
                }
              } else {
                for (const r of records.slice(-7)) {
                  const date = new Date(r.recordedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  if (!dateMap[date]) dateMap[date] = {};
                  dateMap[date][`temp_${farm.id}`] = Math.round(r.temperature);
                  dateMap[date][`humidity_${farm.id}`] = Math.round(r.humidity);
                }
              }
            } catch (err) {
              console.error(`Грешка при влечење историја за фарма ${farm.name}:`, err);
            }
          })
      );

      const sortedDates = Object.keys(dateMap).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      setChartData(sortedDates.map((date) => ({ date, ...dateMap[date] })));

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load farms.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your farms...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Temperature and Humidity Chart  */}
        {farms.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Temperature Trends</CardTitle>
                  <CardDescription>Temperature (°C) per farm (Last 7 Days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: "100%", height: "240px" }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" unit="°C" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                            formatter={(value: number, name: string) => [`${value}°C`, name]}
                        />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                        {farms.map((farm, index) => (
                            <Line
                                key={farm.id}
                                type="monotone"
                                dataKey={`temp_${farm.id}`}
                                stroke={FARM_COLORS[index % FARM_COLORS.length]}
                                strokeWidth={2}
                                name={farm.name}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                connectNulls
                            />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Humidity Trends</CardTitle>
                  <CardDescription>Humidity (%) per farm (Last 7 Days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: "100%", height: "240px" }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" unit="%" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                            formatter={(value: number, name: string) => [`${value}%`, name]}
                        />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                        {farms.map((farm, index) => (
                            <Line
                                key={farm.id}
                                type="monotone"
                                dataKey={`humidity_${farm.id}`}
                                stroke={FARM_COLORS[index % FARM_COLORS.length]}
                                strokeWidth={2}
                                name={farm.name}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                connectNulls
                            />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

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
        {farms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4 text-lg">No farms yet. Add your first farm to get started!</p>
              <Button onClick={() => navigate("/dashboard/add-farm")} className="bg-primary hover:bg-primary-hover">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Farm
              </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {farms.map((farm, index) => (
                  <motion.div
                      key={farm.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                  >
                    <Card
                        className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
                        style={{ borderTop: `4px solid ${FARM_COLORS[index % FARM_COLORS.length]}` }}
                        onClick={() => navigate(`/dashboard/farm/${farm.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{farm.name}</CardTitle>
                            <CardDescription className="mt-1">{farm.location}</CardDescription>
                          </div>
                          {farm.weather && farm.weather.temperature > 30 && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Alert
                              </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {farm.weather ? (
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
                        ) : (
                            <p className="text-sm text-gray-400 italic">Weather data unavailable</p>
                        )}

                        {farm.lastRecommendation && (
                            <div className="p-3 bg-accent rounded-lg border border-green-200">
                              <div className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 line-clamp-2">{farm.lastRecommendation}</p>
                              </div>
                            </div>
                        )}

                        <Button
                            className="w-full bg-primary hover:bg-primary-hover"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/farm/${farm.id}`);
                            }}
                        >
                          Get AI Recommendation
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </div>
        )}
      </div>
  );
}