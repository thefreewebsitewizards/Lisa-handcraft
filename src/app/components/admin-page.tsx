import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Filter } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { Product } from '@/app/types';
import { motion, AnimatePresence } from 'motion/react';

export function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleSave = (product: Product) => {
    if (editingProduct && editingProduct.id) {
      updateProduct(product);
    } else {
      addProduct({ ...product, id: Date.now().toString() });
    }
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    setEditingProduct({
      id: '',
      name: '',
      category: 'drinkware',
      price: 0,
      description: '',
      images: ['https://images.unsplash.com/photo-1704663198277-f3671defb217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHR1bWJsZXIlMjBjdXAlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njk3NzE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080'],
      allowsPersonalization: false,
      inStock: true,
      isMadeToOrder: false,
      tags: [],
    });
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your inventory and store listings</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-secondary mb-8 shadow-sm flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-secondary shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-6 font-bold text-foreground">Product</th>
                  <th className="text-left p-6 font-bold text-foreground">Category</th>
                  <th className="text-left p-6 font-bold text-foreground">Price</th>
                  <th className="text-left p-6 font-bold text-foreground">Status</th>
                  <th className="text-right p-6 font-bold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-secondary" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="capitalize bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                          {product.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-6 font-bold">${product.price.toFixed(2)}</td>
                      <td className="p-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && editingProduct && (
            <ProductEditModal
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setEditingProduct(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProductEditModal({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Product>(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-secondary sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {product.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block mb-2 font-bold text-sm">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-bold text-sm">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="drinkware">Drinkware</option>
                <option value="personalized">Personalized</option>
                <option value="home-decor">Home Decor</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-bold text-sm">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold text-sm">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-sm">Image URL</label>
            <input
              type="text"
              value={formData.images[0]}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="flex flex-wrap gap-6 bg-secondary/20 p-6 rounded-xl border border-secondary">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-medium">In Stock</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isMadeToOrder}
                onChange={(e) => setFormData({ ...formData, isMadeToOrder: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-medium">Made to Order</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowsPersonalization}
                onChange={(e) => setFormData({ ...formData, allowsPersonalization: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-medium">Allows Personalization</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-secondary">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl font-bold hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Save Product
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
