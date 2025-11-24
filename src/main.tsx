import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import { init } from "@tma.js/sdk-react";
import { mockTelegramEnv, emitEvent } from "@tma.js/sdk";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import SettingsPage from "./pages/Settings.tsx";
import InventoryPage from "./pages/Inventory/Inventory.tsx";
import LoginPage from "./pages/auth/Login.tsx";
import AuthGuard from "./components/AuthGuard.tsx";

// Mock Telegram environment in development mode
if (import.meta.env.DEV) {
  try {
    mockTelegramEnv({
      launchParams: {
        tgWebAppData: new URLSearchParams([
          [
            "user",
            JSON.stringify({
              id: 1,
              first_name: "Pavel",
            }),
          ],
          ["hash", ""],
          ["signature", ""],
          ["auth_date", Date.now().toString()],
        ]),
        tgWebAppStartParam: "debug",
        tgWebAppVersion: "8",
        tgWebAppPlatform: "tdesktop",
      },
    });
    console.log("Mock Telegram environment initialized");
  } catch (error) {
    console.error("Failed to mock Telegram environment:", error);
  }
}

init();

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
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
