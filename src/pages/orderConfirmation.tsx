import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Package, MapPin, CreditCard, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type OrderItem = {
  product: string; // Product ID
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type PaymentResult = {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
};

type Order = {
  _id: string;
  user: { _id: string; name: string; email: string };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
};

const OrderConfirmationPage = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Send httpOnly cookie
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Failed to load order details.');
          toast.error(data.message || 'Failed to load order details.');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'An error occurred while loading the order.');
        toast.error(err.message || 'An error occurred while loading the order.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && orderId) {
      fetchOrder();
    } else if (!authLoading && !user) {
      // If not logged in, redirect to login
      toast.error('You must be logged in to view order details.');
      navigate('/login', { replace: true });
    } else if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
    }
  }, [orderId, user, authLoading, navigate]); // Add navigate to dependency array

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
        <p className="ml-3 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    navigate('/dashboard', { replace: true });
    return null; // Return null while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12 flex justify-center items-start">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-healthcare-dark">Order Confirmed!</CardTitle>
            <CardDescription>Thank you for your purchase. Your order has been placed successfully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-lg font-medium">
              Your Order ID: <span className="text-healthcare-primary font-bold">{order._id}</span>
            </div>
            <p className="text-center text-gray-600">You will receive an email confirmation shortly.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Shipping Details */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-4 w-4 mr-2" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" /> Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Method: {order.paymentMethod}</p>
                  <p className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
                    Status: {order.isPaid ? `Paid on ${format(new Date(order.paidAt!), 'PPP')}` : 'Pending Payment'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-4 w-4 mr-2" /> Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.product} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="flex items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" 
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/E0E0E0/333333?text=No+Image`; }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Order Totals */}
            <Card className="shadow-sm">
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>${(order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-xl">
                  <span>Grand Total:</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link to="/dashboard" className="w-full">
              <Button className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90">Go to Dashboard</Button>
            </Link>
            <Link to="/products" className="w-full">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;