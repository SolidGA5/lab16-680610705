import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AdminCouresPage } from "@/pages/admin/coures";
import { ThemeProvider } from "@/components/theme-provider";
import RootLayout from "@/layouts/root-layout";
import HomePage from "@/pages/home";
import AdminEnrollmentsPage from "@/pages/admin/enrollments";
import "./index.css";
import { admin } from "./lib/mock-data";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout firstName={admin.firstName} studentId={admin.studentId} lastName={admin.lastName} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "admin/enrollments", element: <AdminEnrollmentsPage /> },
      { path: "admin/courses", element: <AdminCouresPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
