import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/app/AppLayout";
import AppDashboard from "./pages/app/AppDashboard";
import CheckinPage from "./pages/app/CheckinPage";
import TimelinePage from "./pages/app/TimelinePage";
import MedicationPage from "./pages/app/MedicationPage";
import SettingsPage from "./pages/app/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Index />} />
          
          {/* App routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<AppDashboard />} />
            <Route path="checkin" element={<CheckinPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="medication" element={<MedicationPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
