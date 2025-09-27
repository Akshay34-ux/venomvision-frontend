import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import IdentificationResult from "./pages/IdentificationResult";
import ReportBite from "./pages/ReportBite";
import KnowledgeHub from "./pages/KnowledgeHub";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Handler Flow
import HandlerSignup from "./pages/HandlerSignup";
import HandlerLogin from "./pages/HandlerLogin";
import HandlerDashboard from "./pages/HandlerDashboard";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing is entry point */}
          <Route path="/" element={<LandingPage />} />

          {/* User flow */}
          <Route path="/index" element={<Index />} />
          <Route path="/identify/:snakeId" element={<IdentificationResult />} />
          <Route path="/report-bite" element={<ReportBite />} />
          <Route path="/knowledge-hub" element={<KnowledgeHub />} />
          <Route path="/identify-result" element={<IdentificationResult />} />

          {/* Admin flow */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Handler flow */}
          <Route path="/register-handler" element={<HandlerSignup />} />
          <Route path="/handler-login" element={<HandlerLogin />} />
          <Route path="/handler-dashboard" element={<HandlerDashboard />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;