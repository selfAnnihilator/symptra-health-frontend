import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, User as UserIcon, Clock, Mail, Phone, Loader2, RefreshCcw, Stethoscope, FileText, Brain, ShoppingCart, Navigation } from 'lucide-react'; // Import more icons
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import AppointmentForm from './AppointmentForm';
import { format } from 'date-fns';
import { Link, Navigate } from 'react-router-dom';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

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

const UserDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
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
        headers: {
          'Content-Type': 'application/json',
        },
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
          new Date(b.data.appointmentDate).getTime() - new Date(a.data.appointmentDate).getTime()
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
  }, [user, authLoading, user?.id]);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-healthcare-primary" />
                My Info
              </CardTitle>
              <CardDescription>Quick overview of your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Book Appointment Form */}
          <div className="lg:col-span-2">
            <AppointmentForm />
          </div>
        </div>

        {/* Quick Access Tools */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-healthcare-dark mb-6">Quick Access Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Stethoscope className="h-12 w-12 text-healthcare-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Disease Diagnoser</h3>
                <p className="text-gray-600 mb-4">Analyze symptoms with AI.</p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link to="/diagnosis">Diagnose Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <FileText className="h-12 w-12 text-healthcare-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Medical Report Analyzer</h3>
                <p className="text-gray-600 mb-4">Get insights from your reports.</p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link to="/diagnosis">Analyze Report</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Brain className="h-12 w-12 text-healthcare-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mental Health Checkup</h3>
                <p className="text-gray-600 mb-4">Assess your well-being.</p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link to="/mental-health">Start Checkup</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <ShoppingCart className="h-12 w-12 text-healthcare-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Explore Products</h3>
                <p className="text-gray-600 mb-4">Browse health and wellness products.</p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link to="/products">Shop Now</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Add more quick links as needed */}
          </div>
        </section>

        {/* Recent Appointments Section */}
        <section className="mt-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarCheck className="h-5 w-5 mr-2 text-healthcare-primary" />
                My Recent Appointments
              </CardTitle>
              <CardDescription>A summary of your latest appointment requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
                  <span className="ml-2">Loading appointments...</span>
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appt) => ( // Show up to 3 recent appointments
                    <div key={appt._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">
                          {appt.type === 'appointment_booking' ? appt.data.reasonForVisit : `Free Consultation: ${appt.data.service}`}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          appt.status === 'approved' ? 'bg-green-100 text-green-800' :
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        <CalendarCheck className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                        Date: {format(new Date(appt.data.appointmentDate), 'PPP')} at {appt.data.appointmentTime}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        <Phone className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                        Contact: {appt.type === 'appointment_booking' ? appt.data.patientPhone : appt.data.phoneNumber}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <Mail className="inline-block h-4 w-4 mr-1 align-text-bottom" />
                        Email: {appt.type === 'appointment_booking' ? appt.data.patientEmail : appt.data.email}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Submitted on: {format(new Date(appt.createdAt), 'PPpp')}
                      </p>
                    </div>
                  ))}
                  {appointments.length > 3 && (
                    <div className="text-center mt-4">
                      <Button asChild variant="outline">
                        <Link to="/records">View All Appointments</Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent appointments found.</p>
                  <p className="mt-2">Book your first appointment above!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;