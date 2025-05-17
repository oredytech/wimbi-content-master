
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import NewContent from "./pages/dashboard/NewContent";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="new-content" element={<NewContent />} />
            <Route path="contents" element={<p className="p-4 text-center text-muted-foreground">Liste de vos contenus (à implémenter)</p>} />
            <Route path="wordpress" element={<p className="p-4 text-center text-muted-foreground">Gestion des sites WordPress (à implémenter)</p>} />
            <Route path="social" element={<p className="p-4 text-center text-muted-foreground">Gestion des réseaux sociaux (à implémenter)</p>} />
            <Route path="settings" element={<p className="p-4 text-center text-muted-foreground">Paramètres du compte (à implémenter)</p>} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
