import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Users, 
  Package, 
  FileText, 
  AlertTriangle,
  RefreshCcw,
  ShoppingCart // Import ShoppingCart for Orders tab
} from 'lucide-react';
import { toast } from 'sonner';
import AdminUsersList from '@/components/admin/AdminUsersList';
import AdminProductsList from '@/components/admin/AdminProductsList';
import AdminArticlesList from '@/components/admin/AdminArticlesList';
import AdminRequestsList from '@/components/admin/AdminRequestsList';
import AdminOrdersList from '@/components/admin/AdminOrderList'; // IMPORT THIS
import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user && user.role === 'admin') {
        setIsAdmin(true);
        setLoadingContent(false);
        if (!localStorage.getItem('adminSession')) {
          localStorage.setItem('adminSession', JSON.stringify({
            isAdmin: true,
            email: user.email,
            timestamp: new Date().getTime()
          }));
        }
      } else {
        toast.error('Admin login required or session expired.');
        localStorage.removeItem('adminSession');
        localStorage.removeItem('token');
        navigate('/admin/login', { replace: true });
      }
    }
  }, [user, authLoading, navigate, logout]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminSession');
    toast.success('Admin logged out');
    navigate('/admin/login', { replace: true });
  };

  if (authLoading || loadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-healthcare-primary" />
          <p className="mt-4 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard | Symptra Health</title>
      </Helmet>
      
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-healthcare-primary mr-2" />
            <h1 className="text-xl font-bold">Symptra Health Admin</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8"> {/* Changed to grid-cols-5 */}
            <TabsTrigger value="users" className="flex items-center justify-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center justify-center">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center justify-center"> {/* ADD THIS TAB */}
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <AdminUsersList />
          </TabsContent>
          
          <TabsContent value="products">
            <AdminProductsList />
          </TabsContent>
          
          <TabsContent value="articles">
            <AdminArticlesList />
          </TabsContent>
          
          <TabsContent value="requests">
            <AdminRequestsList />
          </TabsContent>
          
          <TabsContent value="orders"> {/* ADD THIS CONTENT */}
            <AdminOrdersList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
