import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Package, Truck, CreditCard, Box, RefreshCcw, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define the base URL for your backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type OrderItem = {
  product: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};

type Order = {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: any; // Simplified for display
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  totalPrice: number;
  createdAt: string;
};

const MyOrdersPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // This endpoint fetches orders for the logged-in user
        const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          toast.error('Failed to load your orders. Please log in again.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          toast.error(data.message || 'Failed to load orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
        <p className="ml-3 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">My Orders</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Track the status of your recent purchases and view order history.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
            <span className="ml-3 text-lg text-gray-600">Loading orders...</span>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">Order #{order._id.substring(0, 8)}</CardTitle>
                    <CardDescription className="text-sm">Placed on {format(new Date(order.createdAt), 'PPP')}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-healthcare-dark">${order.totalPrice.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isDelivered ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isDelivered ? 'Delivered' : 'In Transit'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium flex items-center">
                        <Package className="h-4 w-4 mr-2" /> Items:
                      </p>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {order.orderItems.map(item => (
                          <li key={item.product}>{item.name} (x{item.quantity})</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium flex items-center">
                        <MapPin className="h-4 w-4 mr-2" /> Shipping to:
                      </p>
                      <p className="text-sm text-gray-700">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      <p className="text-sm text-gray-700">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button asChild variant="outline">
                      <Link to={`/order-confirmation/${order._id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Box className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-700 mb-4">You have not placed any orders yet.</p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;