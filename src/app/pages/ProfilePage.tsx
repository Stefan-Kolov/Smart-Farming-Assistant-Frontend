import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user, logout } = useAuth();

  const initials = user ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase() : '?';
  const fullName = user ? `${user.name} ${user.surname}` : 'Unknown User';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-primary text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{fullName}</h3>
              <p className="text-gray-600 mt-1">@{user?.username}</p>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                {user?.role === 'ROLE_ADMINISTRATOR' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details from the server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">First Name</p>
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Name</p>
              <p className="font-medium text-gray-900">{user?.surname}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Username</p>
              <p className="font-medium text-gray-900">@{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Manage your current login session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
