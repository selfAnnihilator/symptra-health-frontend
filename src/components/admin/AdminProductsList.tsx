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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon, EditIcon, PlusIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

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

const AdminProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    stock: 0
  });
  const { getToken } = useAuth(); // getToken now returns null, but we keep useAuth for context

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // No need for getToken() or Authorization header for httpOnly cookies
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRUCIAL: Browser sends httpOnly cookie automatically
      });

      // If 401, it means the cookie wasn't sent or was invalid.
      // The backend will return success: false and a message.
      if (!response.ok) {
        // If not authenticated, redirect to login or show error
        toast.error('Session expired or not authorized. Please log in again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
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
        toast.error(data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch products on component mount

  const resetForm = () => {
    setCurrentProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      stock: 0
    });
    setIsEditing(false);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct({...product});
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // No need for getToken() or Authorization header for httpOnly cookies
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
          credentials: 'include', // CRUCIAL: Browser sends httpOnly cookie automatically
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProducts(products.filter(product => product.id !== id));
          toast.success('Product deleted successfully');
        } else {
          toast.error(data.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // No need for getToken() or Authorization header for httpOnly cookies
    // The browser will send the cookie automatically if it's present and valid.

    try {
      let response;
      let url = `${API_BASE_URL}/products`;
      let method = 'POST';

      if (isEditing) {
        url = `${API_BASE_URL}/products/${currentProduct.id}`;
        method = 'PUT';
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRUCIAL: Browser sends httpOnly cookie automatically
        body: JSON.stringify(currentProduct),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (isEditing) {
          toast.success('Product updated successfully');
        } else {
          toast.success('Product added successfully');
        }
        fetchProducts(); // Re-fetch products to update the list
        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(data.message || `Failed to ${isEditing ? 'update' : 'add'} product`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} product:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} product`);
    }
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
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Product Management</h2>
          <p className="text-sm text-gray-600">Manage products in your store</p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(product)}
                    >
                      <EditIcon className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Product Name</label>
              <Input
                id="name"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input
                  id="category"
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
              <Input
                id="imageUrl"
                type="url"
                value={currentProduct.imageUrl}
                onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
                placeholder="https://example.com/product.jpg"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">Stock Quantity</label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={currentProduct.stock}
                onChange={(e) => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsList;