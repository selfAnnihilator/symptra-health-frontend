import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signup, isLoading: authContextLoading, user } = useAuth();
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
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    await signup(name, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password">Confirm Password</label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
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
                    <span className="mr-2">Creating account</span>
                    <span className="animate-spin">•</span>
                  </span>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-healthcare-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
