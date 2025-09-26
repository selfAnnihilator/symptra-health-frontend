import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading: authContextLoading, user } = useAuth();
  const navigate = useNavigate();

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Effect to handle redirection after AuthContext updates user state
  useEffect(() => {
    // Only proceed if AuthContext has finished its initial loading
    if (authContextLoading) {
      return;
    }

    if (user) { // If a user object exists (meaning they are logged in)
      if (isMounted.current) {
        if (user.role === 'admin') {
          // If admin, redirect to admin dashboard
          localStorage.setItem('adminSession', JSON.stringify({
            isAdmin: true,
            email: user.email,
            timestamp: new Date().getTime()
          }));
          navigate('/admin/dashboard', { replace: true });
        } else if (user.role === 'user') {
          // For regular users, redirect to general dashboard
          navigate('/dashboard', { replace: true }); // CHANGED FROM /profile TO /dashboard
        }
      }
    }
  }, [user, navigate, authContextLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted.current) return;

    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link to="#" className="text-sm text-healthcare-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
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
                disabled={authContextLoading}
              >
                {authContextLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">Signing in</span>
                    <span className="animate-spin">•</span>
                  </span>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-healthcare-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;