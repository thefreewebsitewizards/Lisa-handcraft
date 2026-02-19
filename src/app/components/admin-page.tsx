import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Filter, ImageUp, List, LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { Product } from '@/app/types';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { callFunction, storage, STORE_ID } from '@/app/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const LISA_ADMIN_EMAIL = 'lisahandmadecraft@admin.com';
const FIREBASE_PROJECT_ID =
  (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined) ?? 'multi-tanent-projects';

export function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, authReady, user, claims, storeId, login, logout, refreshToken } =
    useApp();
  const [view, setView] = useState<'products' | 'form'>('products');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [didAttemptBootstrap, setDidAttemptBootstrap] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasStoreAccess = claims?.storeId === storeId;
  const isAdmin = hasStoreAccess && claims?.role === 'admin';
  const isLisaAdminEmail = (user?.email ?? '').trim().toLowerCase() === LISA_ADMIN_EMAIL;
  const firestoreDocUrl = `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/firestore/data/~2Fstores~2F${encodeURIComponent(
    storeId,
  )}`;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setActiveProduct(product);
    setView('form');
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteCandidate(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteCandidate.id);
      setDeleteCandidate(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    if (isWorking) return;
    setIsWorking(true);
    try {
      await logout();
    } finally {
      setIsWorking(false);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      if (product.id) {
        await updateProduct(product);
      } else {
        await addProduct(product);
      }
      setActiveProduct(null);
      setView('products');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save product.');
    }
  };

  const handleAddNew = () => {
    setActiveProduct({
      id: '',
      name: '',
      category: 'drinkware',
      price: 0,
      description: '',
      images: [],
      allowsPersonalization: false,
      inStock: true,
      isMadeToOrder: false,
      tags: [],
    });
    setView('form');
  };

  const handleSeeProducts = () => {
    setActiveProduct(null);
    setView('products');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (isWorking) return;
    setIsWorking(true);
    setSetupError(null);
    try {
      await login(LISA_ADMIN_EMAIL, password);
      setPassword('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleAssignCustomerAccess = async () => {
    if (isWorking) return;
    setIsWorking(true);
    try {
      await callFunction('assignCustomerClaims', {}, storeId);
      await refreshToken();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to enable store access.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleBootstrapAdmin = async () => {
    if (isWorking) return;
    setIsWorking(true);
    setSetupError(null);
    try {
      await callFunction('bootstrapAdminClaims', {}, storeId);
      await refreshToken();
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : '';
      const message = rawMessage || 'Failed to grant admin access.';
      if (message.toLowerCase().includes('store not found')) {
        setSetupError(`Store not found for "${storeId}".`);
      } else if (message.toLowerCase().includes('missing adminemail')) {
        setSetupError(`Store "${storeId}" is missing adminEmail.`);
      } else if (message.toLowerCase().includes('admin already exists')) {
        setSetupError(`An admin already exists for "${storeId}".`);
      } else if (message.toLowerCase().includes('not allowed')) {
        setSetupError('This account is not allowed to bootstrap admin access.');
      } else {
        setSetupError(message);
      }
    } finally {
      setIsWorking(false);
    }
  };

  useEffect(() => {
    if (!authReady) return;
    if (!user) return;
    if (!isLisaAdminEmail) return;
    if (isAdmin) return;
    if (isWorking) return;
    if (didAttemptBootstrap) return;
    setDidAttemptBootstrap(true);
    void handleBootstrapAdmin();
  }, [authReady, didAttemptBootstrap, isAdmin, isLisaAdminEmail, isWorking, user]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-secondary shadow-lg p-8">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Admin</h1>
            <p className="text-muted-foreground">Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-secondary shadow-lg overflow-hidden">
            <div className="p-6 border-b border-secondary bg-white">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Login</h1>
              <p className="text-muted-foreground">Sign in to manage products for {storeId}.</p>
            </div>
            <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">Email</label>
                <Input
                  value={LISA_ADMIN_EMAIL}
                  className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
                  autoComplete="email"
                  disabled
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-foreground">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
                  autoComplete="current-password"
                  disabled={isWorking}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-60"
                disabled={isWorking}
              >
                Sign In
              </button>
              <div className="text-xs text-muted-foreground pt-1">
                Connected Firebase project: <span className="font-semibold">{FIREBASE_PROJECT_ID}</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isLisaAdminEmail) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-secondary shadow-lg overflow-hidden">
            <div className="p-6 border-b border-secondary bg-white">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Account Required</h1>
              <p className="text-muted-foreground">
                Signed in as {user.email ?? 'user'}. This admin panel is restricted to {LISA_ADMIN_EMAIL}.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <button
                type="button"
                onClick={async () => {
                  if (isWorking) return;
                  setIsWorking(true);
                  try {
                    await logout();
                  } finally {
                    setIsWorking(false);
                  }
                }}
                className="w-full py-3 rounded-xl font-bold bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-60"
                disabled={isWorking}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-secondary shadow-lg overflow-hidden">
            <div className="p-6 border-b border-secondary bg-white">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Setting Up Admin Access</h1>
              <p className="text-muted-foreground">
                Signed in as {user.email ?? 'user'}. Granting admin access for {storeId}.
              </p>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              {setupError && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-foreground">
                  <div className="font-semibold mb-1">Setup error</div>
                  <div className="text-muted-foreground">{setupError}</div>
                  {(setupError.toLowerCase().includes('store not found') ||
                    setupError.toLowerCase().includes('missing adminemail')) && (
                    <div className="text-muted-foreground mt-2">
                      Create a Firestore document at <span className="font-semibold">stores/{storeId}</span> with{' '}
                      <span className="font-semibold">adminEmail</span> set to <span className="font-semibold">{LISA_ADMIN_EMAIL}</span>, then try again.
                      <div className="mt-2">
                        <a
                          href={firestoreDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-primary hover:underline"
                        >
                          Open Firestore document in Firebase Console
                        </a>
                        <div className="text-xs text-muted-foreground mt-1">
                          Project: <span className="font-semibold">{FIREBASE_PROJECT_ID}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={handleBootstrapAdmin}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-60"
                disabled={isWorking}
              >
                Grant Admin Access
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (isWorking) return;
                  setIsWorking(true);
                  try {
                    await logout();
                  } finally {
                    setIsWorking(false);
                  }
                }}
                className="w-full py-3 rounded-xl font-bold bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-60"
                disabled={isWorking}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <AlertDialog
          open={deleteCandidate !== null}
          onOpenChange={(open) => {
            if (isDeleting) return;
            if (!open) setDeleteCandidate(null);
          }}
        >
          <AlertDialogContent className="rounded-3xl border border-secondary shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-2xl">Delete product?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{' '}
                <span className="font-semibold text-foreground">{deleteCandidate?.name ?? 'this product'}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 sm:gap-2">
              <AlertDialogCancel className="rounded-xl" disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="rounded-xl bg-destructive text-white hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your inventory and store listings</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 py-3 px-5 rounded-full font-bold bg-secondary hover:bg-secondary/80 transition-all disabled:opacity-60"
              disabled={isWorking}
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
            <button
              type="button"
              onClick={view === 'form' ? handleSeeProducts : handleAddNew}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5"
            >
              {view === 'form' ? <List className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {view === 'form' ? 'See Products' : 'Add New Product'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {view === 'products' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
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
                <button
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  type="button"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

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
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded-xl border border-secondary"
                                />
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
                                  product.inStock
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
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
                                  type="button"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(product)}
                                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                  title="Delete"
                                  type="button"
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
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              {activeProduct && (
                <ProductForm product={activeProduct} onSave={handleSave} onCancel={handleSeeProducts} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Product>(product);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<Array<{ id: string; file: File; previewUrl: string }>>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const pendingUploadsRef = useRef(pendingUploads);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  useEffect(() => {
    pendingUploadsRef.current = pendingUploads;
  }, [pendingUploads]);

  useEffect(() => {
    return () => {
      pendingUploadsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const createLocalId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const addFiles = (files: FileList | File[]) => {
    const next = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({ id: createLocalId(), file, previewUrl: URL.createObjectURL(file) }));

    if (next.length === 0) return;

    setPendingUploads((prev) => [...prev, ...next]);
  };

  const handleSelectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = '';
  };

  const reorderImages = (from: number, to: number) => {
    setFormData((prev) => {
      const nextImages = [...prev.images];
      const [moved] = nextImages.splice(from, 1);
      nextImages.splice(to, 0, moved);
      return { ...prev, images: nextImages };
    });
  };

  const removeImageAt = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removePendingUpload = (id: string) => {
    setPendingUploads((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const uploadPendingImages = async () => {
    if (pendingUploads.length === 0) return [];

    const uploadedUrls: string[] = [];
    for (const item of pendingUploads) {
      const safeName = item.file.name.replace(/[^\w.\-]+/g, '_');
      const objectPath = `stores/${STORE_ID}/uploads/${Date.now()}_${createLocalId()}_${safeName}`;
      const objectRef = ref(storage, objectPath);
      await uploadBytes(objectRef, item.file, { contentType: item.file.type });
      const url = await getDownloadURL(objectRef);
      uploadedUrls.push(url);
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (formData.images.length === 0 && pendingUploads.length === 0) {
        alert('Please add at least one product image.');
        return;
      }

      const uploadedUrls = await uploadPendingImages();
      const nextProduct: Product = {
        ...formData,
        images: [...formData.images, ...uploadedUrls].filter((x) => typeof x === 'string' && x.trim().length > 0),
        tags: Array.isArray(formData.tags) ? formData.tags.filter((x) => typeof x === 'string' && x.trim().length > 0) : [],
        videoUrl: formData.videoUrl?.trim() ? formData.videoUrl.trim() : undefined,
        variants:
          formData.variants && formData.variants.length > 0
            ? formData.variants
                .map((variant) => ({
                  ...variant,
                  id: variant.id || createLocalId(),
                  name: variant.name.trim(),
                  options: Array.isArray(variant.options)
                    ? variant.options.map((x) => String(x).trim()).filter(Boolean)
                    : [],
                }))
                .filter((variant) => variant.name.length > 0 && variant.options.length > 0)
            : undefined,
      };

      pendingUploads.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setPendingUploads([]);
      await onSave(nextProduct);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-secondary shadow-lg overflow-hidden">
      <div className="p-6 border-b border-secondary bg-white">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          {product.id ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {product.id ? 'Update the details for this product.' : 'Create a new product listing.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">Product Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Product['category'] })}
            >
              <SelectTrigger
                className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
                disabled={isSubmitting}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drinkware">Drinkware</SelectItem>
                <SelectItem value="personalized">Personalized</SelectItem>
                <SelectItem value="home-decor">Home Decor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">Price ($)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value === '' ? 0 : Number(e.target.value),
                })
              }
              className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-foreground">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-32 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-foreground">Images</label>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-secondary bg-white/80 hover:bg-white transition-colors cursor-pointer">
              <ImageUp className="h-4 w-4" />
              <span className="text-sm font-semibold">Select Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSelectFiles}
                disabled={isSubmitting}
                className="hidden"
              />
            </label>
          </div>

          <div
            className={`rounded-2xl border border-dashed p-5 transition-colors ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-secondary bg-secondary/20'
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isSubmitting) return;
              setIsDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isSubmitting) return;
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
              if (isSubmitting) return;
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                addFiles(e.dataTransfer.files);
              }
            }}
          >
            <div className="text-sm text-muted-foreground">
              Drag and drop images here, or use “Select Images”.
            </div>
          </div>

          {(formData.images.length > 0 || pendingUploads.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative rounded-2xl border border-secondary bg-white overflow-hidden"
                  draggable={!isSubmitting}
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={() => {
                    if (dragIndex === null || dragIndex === index) return;
                    reorderImages(dragIndex, index);
                    setDragIndex(null);
                  }}
                >
                  <img src={url} alt="" className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(index)}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 rounded-full bg-white/90 border border-secondary p-1.5 hover:bg-white transition-colors disabled:opacity-60"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {pendingUploads.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl border border-secondary bg-white overflow-hidden"
                >
                  <img src={item.previewUrl} alt={item.file.name} className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => removePendingUpload(item.id)}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 rounded-full bg-white/90 border border-secondary p-1.5 hover:bg-white transition-colors disabled:opacity-60"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-secondary px-2 py-1 text-xs text-muted-foreground truncate">
                    {item.file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">Tags</label>
            <Input
              value={formData.tags.join(', ')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value
                    .split(',')
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
              placeholder="e.g. handmade, gift, tumbler"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-foreground">Video URL (optional)</label>
            <Input
              value={formData.videoUrl ?? ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-secondary bg-secondary/20 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-foreground">Variants</div>
              <div className="text-xs text-muted-foreground">Add options like Size, Color, Material</div>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  variants: [
                    ...(prev.variants ?? []),
                    { id: createLocalId(), name: '', options: [] },
                  ],
                }))
              }
              className="px-4 py-2 rounded-xl bg-white/80 border border-secondary hover:bg-white transition-colors font-semibold text-sm disabled:opacity-60"
            >
              Add Variant
            </button>
          </div>

          {(formData.variants ?? []).length > 0 && (
            <div className="space-y-4">
              {(formData.variants ?? []).map((variant, index) => (
                <div key={variant.id || index} className="rounded-2xl border border-secondary bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block mb-2 text-sm font-semibold text-foreground">Variant Name</label>
                      <Input
                        value={variant.name}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const next = [...(prev.variants ?? [])];
                            next[index] = { ...next[index], name: e.target.value };
                            return { ...prev, variants: next };
                          })
                        }
                        className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
                        placeholder="e.g. Size"
                        disabled={isSubmitting}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          variants: (prev.variants ?? []).filter((_, i) => i !== index),
                        }))
                      }
                      className="mt-7 p-2 rounded-xl border border-secondary bg-white/80 hover:bg-white transition-colors disabled:opacity-60"
                      title="Remove variant"
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </button>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-foreground">Options</label>
                    <Input
                      value={variant.options.join(', ')}
                      onChange={(e) =>
                        setFormData((prev) => {
                          const next = [...(prev.variants ?? [])];
                          next[index] = {
                            ...next[index],
                            options: e.target.value
                              .split(/[,;\n]+/g)
                              .map((x) => x.trim())
                              .filter(Boolean),
                          };
                          return { ...prev, variants: next };
                        })
                      }
                      className="h-11 rounded-xl bg-white border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40"
                      placeholder="e.g. 12 oz, 20 oz"
                      disabled={isSubmitting}
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      Separate multiple options with commas.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-secondary bg-secondary/30 p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 rounded-xl border border-secondary bg-white/80 px-4 py-3 hover:bg-white transition-colors cursor-pointer">
              <Checkbox
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked === true })}
                className="size-5"
                disabled={isSubmitting}
              />
              <span className="font-medium text-sm">In Stock</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-secondary bg-white/80 px-4 py-3 hover:bg-white transition-colors cursor-pointer">
              <Checkbox
                checked={formData.isMadeToOrder}
                onCheckedChange={(checked) => setFormData({ ...formData, isMadeToOrder: checked === true })}
                className="size-5"
                disabled={isSubmitting}
              />
              <span className="font-medium text-sm">Made to Order</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-secondary bg-white/80 px-4 py-3 hover:bg-white transition-colors cursor-pointer">
              <Checkbox
                checked={formData.allowsPersonalization}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allowsPersonalization: checked === true })
                }
                className="size-5"
                disabled={isSubmitting}
              />
              <span className="font-medium text-sm">Personalization</span>
            </label>
          </div>
        </div>

        <div className="pt-2 border-t border-secondary flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-60"
            disabled={isSubmitting}
          >
            See Products
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl disabled:opacity-60"
            disabled={isSubmitting}
          >
            {product.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
