import { useState } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/cartContext';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'sonner';

const CartPage = () => {
  const { cartItems, removeItemFromCart, updateItemQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate(); // Use useNavigate hook
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add some products first!");
      return;
    }
    // Navigate to the checkout page
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Your Shopping Cart</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Review your selected products before proceeding to checkout.
        </p>

        {cartItems.length === 0 ? (
          <Card className="shadow-md text-center py-12">
            <CardContent>
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-700 mb-4">Your cart is empty.</p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <Card key={item.id} className="shadow-sm flex items-center p-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-lg mr-4" 
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/100x100/E0E0E0/333333?text=No+Image`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 text-lg font-medium">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-gray-500 ml-2">({item.stock} in stock)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => removeItemFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
              <div className="text-right mt-4">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90"
                    onClick={handleCheckout} // Now navigates to /checkout
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;