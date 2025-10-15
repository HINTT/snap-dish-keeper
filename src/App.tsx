import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import { AuthForm } from "./components/auth/AuthForm";
import Recipes from "./pages/Recipes";
import SharedRecipe from "./pages/SharedRecipe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Router handled by HashRouter in main.tsx */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shared/:token" element={<SharedRecipe />} />
          {/* fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
