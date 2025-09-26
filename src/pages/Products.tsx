import { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/cartContext';
import { Link } from 'react-router-dom';

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItemToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const fetchedProducts: Product[] = data.data.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            imageUrl: p.imageUrl,
            stock: p.stock,
          }));
          setProducts(fetchedProducts);
        } else {
          toast.error(data.message || 'Failed to load products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Our Products</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Explore our range of health and wellness products designed to support your well-being.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
            <span className="ml-3 text-lg text-gray-600">Loading products...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-t-lg mb-4" 
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/400x300/E0E0E0/333333?text=No+Image`;
                    }}
                  />
                  <CardTitle className="text-xl font-semibold text-healthcare-primary line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Category: {product.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <span className="text-2xl font-bold text-healthcare-dark">${product.price.toFixed(2)}</span>
                  <p className="text-gray-700 mb-4 line-clamp-3">{product.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  {/* Now we only have the "Add to Cart" button */}
                  <Button 
                    className="w-full mt-4 flex items-center gap-2"
                    disabled={product.stock === 0}
                    onClick={() => addItemToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No products available yet.</p>
            <p className="mt-2">Check back later or contact support.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
