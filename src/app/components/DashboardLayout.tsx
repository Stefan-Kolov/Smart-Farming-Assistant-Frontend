import { Link, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Sprout, Brain, FileText, User, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "./ui/sheet";
import { useAuth } from "../context/AuthContext";

export function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.name?.[0] ?? ''}${user.surname?.[0] ?? ''}`.toUpperCase()
    : '?';
  const fullName = user ? `${user.name} ${user.surname}` : 'User';
  const email = user?.email ?? '';

  const navItems = [
    { icon: Sprout, label: "Farms", path: "/dashboard", id: "farms" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports", id: "reports" },
    { icon: User, label: "Profile", path: "/dashboard/profile", id: "profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Smart Farming</h1>
              <p className="text-xs text-gray-500">Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Open navigation menu">
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0" aria-describedby="mobile-navigation-description">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription id="mobile-navigation-description">
                      Access your dashboard, farms, AI insights, reports, and profile settings
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                          <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold text-gray-900">Smart Farming</h1>
                          <p className="text-xs text-gray-500">Assistant</p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4">
                      <ul className="space-y-1">
                        {navItems.map((item) => {
                          const isActive = location.pathname === item.path;
                          return (
                            <li key={item.id}>
                              <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>

                    {/* Mobile User Section */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{email}</p>
                        </div>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                  {location.pathname === "/dashboard" && "Dashboard"}
                  {location.pathname === "/dashboard/reports" && "Reports"}
                  {location.pathname === "/dashboard/profile" && "Profile"}
                  {location.pathname.includes("/dashboard/farm/") && !location.pathname.includes("edit") && "Farm Details"}
                  {location.pathname.includes("/dashboard/add-farm") && "Add Farm"}
                  {location.pathname.includes("/dashboard/edit-farm") && "Edit Farm"}
                  {location.pathname.includes("/dashboard/add-crop") && "Add Crop"}
                  {location.pathname.includes("/dashboard/edit-crop") && "Edit Crop"}
                  {location.pathname.includes("/dashboard/recommend") && "AI Recommendation"}
                </h2>
                <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                  {location.pathname === "/dashboard" && "Monitor your farms and get AI-powered insights"}
                  {location.pathname === "/dashboard/reports" && "View all recommendations and export data"}
                  {location.pathname === "/dashboard/profile" && "Manage your account settings"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification icon removed */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}