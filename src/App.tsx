import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/cartContext';
import { Toaster } from './components/ui/sonner';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import Records from './pages/Records';
import AIAssistant from './pages/AIAssistant';
import DiseaseDiagnosis from './pages/DiseaseDiagnosis';
import Hospitals from './pages/Hospitals';
import Index from './pages/Index';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import FAQs from './pages/FAQs';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import MentalHealth from './pages/MentalHealth';
import Products from './pages/Products';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/orderConfirmation';
import MyOrdersPage from './pages/MyOrderPages';
import ReturnAndReplacment from './pages/ReturnandReplacement';
import MedicalReportPage from './pages/MedicalReportPage'; // IMPORT THIS
import { Loader2 } from 'lucide-react';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
        <p className="ml-3 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/diagnosis" element={<DiseaseDiagnosis />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/products" element={<Products />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/return-policy" element={<ReturnAndReplacment />} />
            <Route path="/medical-report" element={<MedicalReportPage />} /> {/* ADD THIS NEW ROUTE */}

            {/* Private Routes (User) */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/order-confirmation/:id" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />

            {/* Admin Private Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;