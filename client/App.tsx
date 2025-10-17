import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/site/Layout";
import Collections from "@/pages/Collections";
import About from "@/pages/About";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";       
import EditProfile from "@/pages/EditProfile"; 
import Address from "./pages/Address";
import Payment from "@/pages/Payment";
import OrderSuccess from "@/pages/OrderSuccess";

// ✅ new settings sub-pages
import HelpCenter from "@/pages/HelpCenter";
import BankAndUPI from "@/pages/BankAndUPI";
import ChangeLanguage from "@/pages/ChangeLanguage";
import GoogleAuthCallback from "./components/GoogleAuthCallback";

const queryClient = new QueryClient();

import { CartProvider } from "@/store/cart";
import { AuthProvider } from "@/store/auth";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />       {/* ✅ main settings */}
                <Route path="/settings/help" element={<HelpCenter />} /> {/* ✅ Help Centre */}
                <Route path="/settings/bank-upi" element={<BankAndUPI />} /> {/* ✅ Bank & UPI */}
                <Route path="/settings/language" element={<ChangeLanguage />} /> {/* ✅ Change Language */}
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/address" element={<Address />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
              </Route>

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
