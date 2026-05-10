import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Download, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { listFarms } from "../api/farms";
import { getFarmRecommendations, type RecommendationDto } from "../api/recommendations";

interface EnrichedRec extends RecommendationDto {
  farmName: string;
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

  useEffect(() => {
    loadAllRecommendations();
  }, []);

  const loadAllRecommendations = async () => {
    try {
      setLoading(true);
      const farms = await listFarms();
      const all = await Promise.all(
        farms.map(async (farm) => {
          try {
            const recs = await getFarmRecommendations(farm.id);
            console.log(`Farm "${farm.name}" (id=${farm.id}): ${recs.length} recommendations`);
            return recs.map((r) => ({ ...r, farmName: farm.name }));
          } catch (e) {
            console.error(`Failed to load recommendations for farm "${farm.name}" (id=${farm.id}):`, e);
            return [];
          }
        })
      );
      const sorted = all.flat().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecommendations(sorted);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Farm', 'Risk Level', 'Temperature', 'Humidity', 'Rainfall', 'Content'],
      ...recommendations.map((rec) => [
        new Date(rec.createdAt).toLocaleDateString(),
        rec.farmName,
        rec.riskLevel,
        `${rec.temperature}°C`,
        `${rec.humidity}%`,
        `${rec.rainfall}mm`,
        `"${rec.content?.replace(/"/g, '""').substring(0, 100)}..."`,
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recommendations_report.csv';
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
            {recommendations.length > 0 && (
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
          {recommendations.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-500 mb-6">
                Start generating AI recommendations for your crops to see them here
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-primary hover:bg-primary-hover"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Farm</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Weather</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{rec.farmName}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(rec.riskLevel as Priority)}>
                          {rec.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {rec.temperature?.toFixed(1)}°C / {rec.humidity?.toFixed(0)}%
                      </TableCell>
                      <TableCell className="max-w-md">
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