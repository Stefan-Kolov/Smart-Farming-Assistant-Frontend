import React from "react";
import { useNavigate } from "react-router";
import { Download, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { mockRecommendations } from "../data/mockData";

export function ReportsPage() {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    // Mock CSV export
    const csvContent = [
      ['Date', 'Farm', 'Crop', 'Summary', 'Type', 'Priority'],
      ...mockRecommendations.map(rec => [
        rec.date,
        rec.farmName,
        rec.cropName,
        rec.irrigation.substring(0, 50) + '...',
        rec.isAI ? 'AI Generated' : 'Rule-based',
        rec.priority
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recommendations_report.csv';
    a.click();
  };

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
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Recommendation History</CardTitle>
              <CardDescription>View and export all AI-generated recommendations</CardDescription>
            </div>
            <Button 
              onClick={handleExportCSV}
              className="bg-primary hover:bg-primary-hover w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockRecommendations.length === 0 ? (
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
                    <TableHead>Crop</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecommendations.map((rec) => (
                    <TableRow key={rec.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {new Date(rec.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{rec.farmName}</TableCell>
                      <TableCell>{rec.cropName}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate text-gray-600">
                          {rec.irrigation.substring(0, 60)}...
                        </p>
                      </TableCell>
                      <TableCell>
                        {rec.isAI ? (
                          <Badge variant="default" className="bg-primary">
                            AI Generated
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning text-white">
                            Rule-based
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/recommendation/${rec.id}`)}
                        >
                          View Details
                        </Button>
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