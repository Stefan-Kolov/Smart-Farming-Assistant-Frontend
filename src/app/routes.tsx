import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FarmDetailsPage } from "./pages/FarmDetailsPage";
import { AddFarmPage } from "./pages/AddFarmPage";
import { AddCropPage } from "./pages/AddCropPage";
import { RecommendationPage } from "./pages/RecommendationPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ReportsPage } from "./pages/ReportsPage";
import { WireframesPage } from "./pages/WireframesPage";
import { DashboardLayout } from "./components/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "farm/:farmId",
        Component: FarmDetailsPage,
      },
      {
        path: "add-farm",
        Component: AddFarmPage,
      },
      {
        path: "add-crop/:farmId",
        Component: AddCropPage,
      },
      {
        path: "recommendation/:recommendationId",
        Component: RecommendationPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "reports",
        Component: ReportsPage,
      },
      {
        path: "wireframes",
        Component: WireframesPage,
      },
    ],
  },
]);