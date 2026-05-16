import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Download, FileText, Loader2, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { listFarms } from "../api/farms";
import { listCropsByFarm } from "../api/crops";
import { getFarmRecommendations, type RecommendationDto } from "../api/recommendations";

interface EnrichedRec extends RecommendationDto {
  farmName: string;
  cropName: string;
}

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'HIGH': return 'bg-destructive text-white';
    case 'MEDIUM': return 'bg-warning text-white';
    case 'LOW': return 'bg-success text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export function ReportsPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<EnrichedRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [filterFarm, setFilterFarm] = useState<string>("ALL");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  useEffect(() => {
    loadAllRecommendations();
  }, []);

  const loadAllRecommendations = async () => {
    try {
      setLoading(true);
      const farms = await listFarms();

      // Build cropId → cropName map by fetching crops for each farm
      const cropMap = new Map<number, string>();
      const all = await Promise.all(
        farms.map(async (farm) => {
          try {
            const [recs, crops] = await Promise.all([
              getFarmRecommendations(farm.id),
              listCropsByFarm(farm.id),
            ]);
            crops.forEach((c) => cropMap.set(c.id, c.name));
            return recs.map((r) => ({ ...r, farmName: farm.name }));
          } catch {
            return [];
          }
        })
      );

      const sorted: EnrichedRec[] = all
        .flat()
        .map((r) => ({
          ...r,
          cropName: r.cropId ? cropMap.get(r.cropId) ?? "—" : "—",
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setRecommendations(sorted);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Unique farm names for the filter dropdown
  const farmNames = useMemo(
    () => Array.from(new Set(recommendations.map((r) => r.farmName))),
    [recommendations]
  );

  // Apply filters
  const filtered = useMemo(() => {
    return recommendations.filter((r) => {
      const farmOk = filterFarm === "ALL" || r.farmName === filterFarm;
      const riskOk = filterRisk === "ALL" || r.riskLevel === filterRisk;
      return farmOk && riskOk;
    });
  }, [recommendations, filterFarm, filterRisk]);

  const handleExportCSV = () => {
    const csvContent = [
      ["Date", "Farm", "Crop", "Risk Level", "Temperature", "Humidity", "Rainfall", "Content"],
      ...filtered.map((rec) => [
        new Date(rec.createdAt).toLocaleDateString(),
        rec.farmName,
        rec.cropName,
        rec.riskLevel,
        `${rec.temperature}°C`,
        `${rec.humidity}%`,
        `${rec.rainfall}mm`,
        `"${rec.content?.replace(/"/g, '""').substring(0, 100)}..."`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recommendations_report.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Recommendation History</CardTitle>
              <CardDescription>View and export all AI-generated recommendations across your farms</CardDescription>
            </div>
            {filtered.length > 0 && (
              <Button
                onClick={handleExportCSV}
                className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {recommendations.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <Filter className="w-4 h-4" />
                Filter:
              </div>
              <Select value={filterFarm} onValueChange={setFilterFarm}>
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <SelectValue placeholder="All Farms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Farms</SelectItem>
                  {farmNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full sm:w-44 bg-white">
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Risk Levels</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              {(filterFarm !== "ALL" || filterRisk !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterFarm("ALL"); setFilterRisk("ALL"); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear filters
                </Button>
              )}

              <span className="text-sm text-gray-500 self-center ml-auto">
                {filtered.length} of {recommendations.length} records
              </span>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {recommendations.length === 0 ? "No Recommendations Yet" : "No Results Match Your Filters"}
              </h3>
              <p className="text-gray-500 mb-6">
                {recommendations.length === 0
                  ? "Start generating AI recommendations for your crops to see them here"
                  : "Try adjusting or clearing your filters"}
              </p>
              {recommendations.length === 0 && (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-primary hover:bg-primary-hover"
                >
                  Go to Dashboard
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Farm</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Weather</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium whitespace-nowrap">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{rec.farmName}</TableCell>
                      <TableCell>
                        <span className={rec.cropName === "—" ? "text-gray-400 italic" : "text-gray-800"}>
                          {rec.cropName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(rec.riskLevel as Priority)}>
                          {rec.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        {rec.temperature?.toFixed(1)}°C / {rec.humidity?.toFixed(0)}%
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-gray-600">
                          {rec.content?.substring(0, 80)}...
                        </p>
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