import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import SettingsPage from "./pages/Settings.tsx";
import InventoryPage from "./pages/Inventory/Inventory.tsx";
import CosmeticsPage from "./pages/Cosmetics/Cosmetics.tsx";
import LoginPage from "./pages/auth/Login.tsx";
import AuthGuard from "./components/AuthGuard.tsx";

import { init } from "@/init.ts";

import "./mockEnv.ts";
import { retrieveLaunchParams } from "@tma.js/sdk-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 0,
    },
  },
});

const router = createMemoryRouter([
  // Public routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  // Protected routes
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <AuthGuard>
          <App />
        </AuthGuard>
      </QueryClientProvider>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "cosmetics", element: <CosmeticsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);



try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug =
    (launchParams.tgWebAppStartParam || "").includes("debug") ||
    import.meta.env.DEV;

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() =>
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    )
  );
} catch (e) {
  console.error("Failed to initialize the application:", e);
 
}
