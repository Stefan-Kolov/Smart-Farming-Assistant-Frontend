import React, { type FormEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { getFarm, updateFarm } from "../api/farms";

export function EditFarmPage() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!farmId) return;
    getFarm(Number(farmId))
      .then((farm) => {
        setName(farm.name);
        setLocation(farm.location);
      })
      .catch(() => setError("Failed to load farm details."))
      .finally(() => setFetchLoading(false));
  }, [farmId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updateFarm(Number(farmId), { name, location });
      setSuccess(true);
      setTimeout(() => navigate(`/dashboard/farm/${farmId}`), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update farm.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/dashboard/farm/${farmId}`)}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Farm
      </Button>

      <Card className="border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle>Edit Farm</CardTitle>
          <CardDescription>Update the details of your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Farm updated successfully! Redirecting...
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="farm-name">Farm Name *</Label>
              <Input
                id="farm-name"
                type="text"
                placeholder="e.g., Green Valley Farm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., California, USA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="bg-input-background"
              />
              <p className="text-sm text-gray-500">
                Enter city/state for weather tracking
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover"
                disabled={loading || success}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/dashboard/farm/${farmId}`)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
