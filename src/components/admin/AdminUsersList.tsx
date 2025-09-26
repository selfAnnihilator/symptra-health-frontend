import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  // ADDED NEW FIELDS
  weight?: number;
  pastDiseases?: string[];
  parentName?: string;
  parentPhone?: string;
};

const AdminUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        toast.error('Session expired or not authorized. Please log in again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        const fetchedUsers: User[] = data.data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          // MAP NEW FIELDS
          weight: u.weight,
          pastDiseases: u.pastDiseases,
          parentName: u.parentName,
          parentPhone: u.parentPhone,
        }));
        setUsers(fetchedUsers);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string, email: string) => {
    if (currentUser && currentUser.email === email) {
      toast.error('You cannot delete your own admin account');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUsers(users.filter(user => user.id !== id));
          toast.success('User deleted successfully');
        } else {
          toast.error(data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">User Management</h2>
        <p className="text-sm text-gray-600">Manage user accounts and roles</p>
      </div>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Health Info</TableHead> {/* NEW COLUMN */}
              <TableHead>Parent's Info</TableHead> {/* NEW COLUMN */}
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell> {/* NEW HEALTH INFO CELL */}
                    <div className="text-sm">
                      <p>Weight: {user.weight ? `${user.weight}kg` : 'N/A'}</p>
                      <p>Past Diseases: {user.pastDiseases?.length ? user.pastDiseases.join(', ') : 'None'}</p>
                    </div>
                  </TableCell>
                  <TableCell> {/* NEW PARENT INFO CELL */}
                    <div className="text-sm">
                      <p>Name: {user.parentName || 'N/A'}</p>
                      <p>Phone: {user.parentPhone || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={currentUser && currentUser.email === user.email}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersList;