import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../page/LoginPage";
import { Navigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import DashboardPage from "../page/DashboardPage";
import SettingPage from "../page/SettingPage";
import PlacesPage from "../page/PlacesPage";
import ActivitiesPage from "../page/ActivitiesPage";
import EventsPage from "../page/EventsPage";
import ItinerariesPage from "../page/ItinerariesPage";


const router = createBrowserRouter([
    {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/places",
        element: <PlacesPage />,
      },
      {
        path: "/activities",
        element: <ActivitiesPage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/itineraries",
        element: <ItinerariesPage />,
      },
      {
        path    : "/setting",
        element : <SettingPage />
      },
    ],
  },
]);

export default router;