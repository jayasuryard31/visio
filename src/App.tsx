
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import { usePWA } from './hooks/usePWA';
import LandingPage from './components/LandingPage';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Wellness from "./pages/Wellness";
import Journal from "./pages/Journal";
import Schedule from "./pages/Schedule";
import FocusMode from "./pages/FocusMode";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35',
    },
    secondary: {
      main: '#f7931e',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

const AppContent: React.FC = () => {
  const { isPWA } = usePWA();
  const [showLanding, setShowLanding] = React.useState(true);
  const [hasVisited, setHasVisited] = React.useState(false);

  React.useEffect(() => {
    const visited = localStorage.getItem('visio-has-visited');
    if (visited || isPWA) {
      setShowLanding(false);
      setHasVisited(true);
    }
  }, [isPWA]);

  const handleGetStarted = () => {
    localStorage.setItem('visio-has-visited', 'true');
    setShowLanding(false);
    setHasVisited(true);
  };

  if (showLanding && !hasVisited && !isPWA) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/wellness" element={<Wellness />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/focus" element={<FocusMode />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  </QueryClientProvider>
);

export default App;
