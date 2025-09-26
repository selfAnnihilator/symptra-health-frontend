import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/cartContext';
import AppointmentForm from '../components/dashboard/AppointmentForm';
import { Loader2, RefreshCcw, CalendarCheck, User as UserIcon, Calendar, Box, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { format, isFuture } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'; // Import recharts components

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Type definition for an appointment request from the backend
type AppointmentRequest = {
  _id: string;
  type: 'appointment_booking' | 'free_consultation';
  status: 'pending' | 'approved' | 'rejected';
  data: {
    patientName?: string;
    fullName?: string;
    patientEmail?: string;
    email?: string;
    patientPhone?: string;
    phoneNumber?: string;
    appointmentDate: string;
    appointmentTime: string;
    reasonForVisit?: string;
    service?: string;
  };
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
};

// Mock data for the Health Trends chart
const healthTrendsData = [
  { name: 'Jan', weight: 70, steps: 5000 },
  { name: 'Feb', weight: 71, steps: 6000 },
  { name: 'Mar', weight: 70, steps: 6500 },
  { name: 'Apr', weight: 69, steps: 7000 },
  { name: 'May', weight: 68, steps: 8000 },
  { name: 'Jun', weight: 68, steps: 7500 },
];

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { getCartItemCount } = useCart();
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const fetchUserAppointments = async () => {
    if (!user) {
      setLoadingAppointments(false);
      return;
    }
    setLoadingAppointments(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/user`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        toast.error('Failed to load your appointments. Please log in again.');
        setLoadingAppointments(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        const userAppointments = data.data.filter(
          (req: any) => req.type === 'appointment_booking' || req.type === 'free_consultation'
        );
        userAppointments.sort((a: AppointmentRequest, b: AppointmentRequest) => 
          new Date(a.data.appointmentDate).getTime() - new Date(b.data.appointmentDate).getTime()
        );
        setAppointments(userAppointments);
      } else {
        toast.error(data.message || 'Failed to load appointments.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserAppointments();
    } else if (!authLoading && !user) {
      setLoadingAppointments(false);
    }
  }, [user, authLoading]);

  const upcomingAppointments = appointments.filter(
    (appt) => isFuture(new Date(appt.data.appointmentDate)) && appt.status === 'approved'
  ).slice(0, 3);
  const isNoAppointments = upcomingAppointments.length === 0;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-healthcare-primary" />
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    toast.error('You must be logged in to view your dashboard.');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Your personalized health dashboard. Manage your appointments and access quick tools.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-healthcare-primary" />
                Health Trends
              </CardTitle>
              <CardDescription>Your health metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrendsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="steps" stroke="#10B981" name="Steps" />
                  <Line type="monotone" dataKey="weight" stroke="#3B82F6" name="Weight (kg)" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-gray-500 mt-2">Health metrics visualization would go here</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-healthcare-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled medical appointments.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loadingAppointments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                  <span className="ml-2">Loading appointments...</span>
                </div>
              ) : isNoAppointments ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No upcoming appointments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appt) => (
                    <div key={appt._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                      <h3 className="font-semibold text-lg text-healthcare-dark">{appt.data.patientName || appt.data.fullName}</h3>
                      <p className="text-gray-600 text-sm">{appt.data.reasonForVisit || appt.data.service}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(appt.data.appointmentDate), 'PP')} at {appt.data.appointmentTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link to="/records">View All Appointments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-healthcare-dark mb-4">Schedule an Appointment</h2>
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;