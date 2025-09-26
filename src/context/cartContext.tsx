import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Define the type for a product in the cart
type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number; // Keep track of original stock for validation
};

// Define the shape of the Cart Context
type CartContextType = {
  cartItems: CartItem[];
  addItemToCart: (product: { id: string; name: string; price: number; imageUrl: string; stock: number }) => void;
  removeItemFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
};

// Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the Cart Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add item to cart or increase quantity if it already exists
  const addItemToCart = (product: { id: string; name: string; price: number; imageUrl: string; stock: number }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // If item exists, increase quantity, but not beyond stock
        if (existingItem.quantity + 1 > product.stock) {
          toast.error(`Cannot add more "${product.name}". Stock limit reached.`);
          return prevItems; // Return previous state if stock limit reached
        }
        toast.success(`Added another "${product.name}" to cart.`);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        if (product.stock === 0) {
          toast.error(`"${product.name}" is out of stock.`);
          return prevItems;
        }
        toast.success(`"${product.name}" added to cart.`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item completely from cart
  const removeItemFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    toast.info("Item removed from cart.");
  };

  // Update quantity of an item
  const updateItemQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item // Quantity must be at least 1
      );
      // Optional: Add toast for quantity update
      return updatedItems;
    });
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared.");
  };

  // Calculate total price of items in cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get total number of items (sum of quantities) in cart
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};