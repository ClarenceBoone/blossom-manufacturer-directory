'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    specifications: {} as Record<string, unknown>,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    // Mock products for demo
    const mockProducts: Product[] = Array(8).fill(null).map((_, index) => ({
      id: `product-${index + 1}`,
      userId: currentUser?.uid || 'demo-user',
      name: 'Leather Bag',
      description: 'Lorem ipsum dolor sit amet consectetur. Viverra sem porttitor egestas purus.',
      category: 'Accessories',
      images: ['/api/placeholder/300/300'],
      specifications: {
        material: 'Leather',
        color: 'Brown',
        size: 'Medium'
      },
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Load products regardless of auth state for demo
    setProducts(mockProducts);
    setLoading(false);
  }, [currentUser]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (!currentUser || !newProduct.name) return;

    try {
      const imageUrls: string[] = [];
      
      // Upload files to Firebase Storage
      for (const file of selectedFiles) {
        const fileRef = ref(storage, `products/${currentUser.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        imageUrls.push(url);
      }

      // Create product document
      const productData: Omit<Product, 'id'> = {
        userId: currentUser.uid,
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        images: imageUrls,
        specifications: newProduct.specifications,
        files: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      
      // Add to local state
      setProducts(prev => [...prev, { ...productData, id: docRef.id }]);
      
      // Reset form
      setNewProduct({ name: '', description: '', category: '', specifications: {} });
      setSelectedFiles([]);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading product:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // For mock products (development), just update state
      if (productId.startsWith('product-')) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
        return;
      }

      // For real products from Firebase
      if (currentUser) {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-48">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Library</h1>
          <p className="text-gray-500 text-lg mb-8">Upload and manage your products all in one place.</p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-500 text-sm">{products.length} Products</p>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white text-pink-600 border-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors px-6"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your library
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Describe your product"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="apparel">Apparel</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="files">Product Images</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" className="bg-white text-pink-600 border-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6" onClick={handleUpload} disabled={!newProduct.name}>
                    Upload Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group border-0 shadow-sm hover:shadow-md transition-shadow p-0">
              <div className="relative bg-gray-100">
                <img
                  src={product.images[0] || '/api/placeholder/300/300'}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4 pt-0">
                <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                <Button
                  variant="outline"
                  className="w-full bg-white text-pink-600 border-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-colors py-2 font-medium"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  View Product
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-gray-100">{'<'}</Button>
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl bg-pink-600 text-white hover:bg-pink-700 border-pink-600">1</Button>
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-gray-100">2</Button>
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-gray-100">3</Button>
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-gray-100">4</Button>
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-gray-100">5</Button>
            <Button variant="outline" size="sm" className="w-12 h-12 p-0 rounded-xl hover:bg-gray-100">{'>'}</Button>
          </div>
        </div>
      </main>
    </div>
  );
}