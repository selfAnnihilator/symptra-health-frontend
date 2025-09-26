import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation'; // Assuming Navigation is used here

// Define the base URL for your backend API (AuthContext also uses this)
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, isLoading: authContextLoading } = useAuth(); // Get user, login, and authContextLoading
  const navigate = useNavigate();

  const isMounted = useRef(true); // Ref to track component mount status

  useEffect(() => {
    return () => {
      isMounted.current = false; // Set to false on unmount
    };
  }, []);

  // Effect to handle redirection after AuthContext updates user state
  useEffect(() => {
    // Only proceed if AuthContext has finished its initial loading
    if (authContextLoading) {
      return;
    }

    if (user && user.role === 'admin') {
      // Ensure adminSession is set for AdminDashboard.tsx to use
      if (!localStorage.getItem('adminSession')) {
        localStorage.setItem('adminSession', JSON.stringify({
          isAdmin: true,
          email: user.email,
          timestamp: new Date().getTime()
        }));
      }
      if (isMounted.current) {
        toast.success('Admin login successful!'); // Show success toast here
        navigate('/admin/dashboard', { replace: true });
      }
    } else if (user && user.role !== 'admin' && !authContextLoading) {
      // If a non-admin user is logged in (and auth is done loading), redirect them away from admin login
      if (isMounted.current) {
        toast.error('Access Denied: You do not have admin privileges.');
        // Optionally, log them out from the regular session if they shouldn't be logged in at all
        // logout(); // Uncomment if you want to force logout non-admins from this page
        navigate('/login', { replace: true }); // Redirect to regular login
      }
    }
    // If user is null and not loading, no action needed, let the form handle login
  }, [user, navigate, authContextLoading]); // Depend on user, navigate, and authContextLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted.current) return;
    
    setIsLoading(true);
    
    try {
      // Call the login function from AuthContext. It returns true/false for success.
      // Redirection is handled by the useEffect above, which reacts to `user` state changes.
      await login(email, password); 

    } catch (error) {
      // AuthContext's login already handles its own toast.error,
      // so we don't need a redundant toast here unless for specific unhandled errors.
      console.error("Admin login process error:", error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-healthcare-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">Logging in</span>
                    <span className="animate-spin">•</span>
                  </span>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Admin Login
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;