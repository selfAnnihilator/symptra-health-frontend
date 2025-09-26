import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  // ADDED NEW FIELDS
  weight?: number;
  pastDiseases?: string[];
  parentName?: string;
  parentPhone?: string;
};

const UserProfile = () => {
  const { user, getToken, isLoading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }
      setLoadingProfile(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProfileData({
            id: data.data._id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role,
            phone: data.data.phone || '',
            address: data.data.address || '',
            // ADDED NEW FIELDS TO STATE
            weight: data.data.weight,
            pastDiseases: data.data.pastDiseases || [],
            parentName: data.data.parentName || '',
            parentPhone: data.data.parentPhone || '',
          });
        } else {
          toast.error(data.message || 'Failed to load user profile.');
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile.');
        setProfileData(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!authLoading && user) {
      fetchUserProfile();
    } else if (!authLoading && !user) {
        setLoadingProfile(false);
    }
  }, [user, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Handle number input for weight
    if (id === 'weight') {
      const numValue = parseFloat(value);
      setProfileData(prev => prev ? { ...prev, [id]: isNaN(numValue) ? null : numValue } : null);
    } else if (id === 'pastDiseases') {
      // Handle array of strings for past diseases
      setProfileData(prev => prev ? { ...prev, [id]: value.split(',').map(d => d.trim()).filter(Boolean) } : null);
    } else {
      setProfileData(prev => prev ? { ...prev, [id]: value } : null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          // ADDED NEW FIELDS TO PAYLOAD
          weight: profileData.weight,
          pastDiseases: profileData.pastDiseases,
          parentName: profileData.parentName,
          parentPhone: profileData.parentPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
          <p className="mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    toast.error('You must be logged in to view your profile.');
    return <Navigate to="/login" replace />;
  }

  if (user && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        <p>Could not load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">My Profile</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Manage your personal information and account settings.
        </p>

        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <UserIcon className="h-10 w-10 text-healthcare-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Personal Information</CardTitle>
            <CardDescription className="text-center">
              Update your details below.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., +1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Health St, Medical City"
                />
              </div>

              {/* ADDED NEW FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profileData.weight || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastDiseases">Past Diseases (comma separated)</Label>
                  <Input
                    id="pastDiseases"
                    value={profileData.pastDiseases?.join(', ') || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Asthma, Allergy"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent's Name</Label>
                  <Input
                    id="parentName"
                    value={profileData.parentName || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent's Phone Number</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    value={profileData.parentPhone || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., +1234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </CardContent>
            <CardContent>
              <Button 
                type="submit" 
                className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">Saving</span>
                    <span className="animate-spin">•</span>
                  </span>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;