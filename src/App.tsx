import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import BuyerCatalog from "./pages/BuyerCatalog";
import CreatorGallery from "./pages/CreatorGallery";
import CreatorDashboard from "./pages/CreatorDashboard";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";
import HomeRedirect from "@/components/HomeRedirect";

const queryClient = new QueryClient();

// Detect if we're on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const basename = isGitHubPages ? '/Stockless' : '';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/buyers" element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerCatalog />
                </ProtectedRoute>
              } />
              <Route path="/profile/:id" element={
                <ProtectedRoute requiredRole="buyer">
                  <CreatorGallery />
                </ProtectedRoute>
              } />
              <Route path="/creator-dashboard/:id" element={
                <ProtectedRoute requiredRole="creator">
                  <CreatorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/checkout/success" element={
                <ProtectedRoute>
                  <CheckoutSuccess />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
