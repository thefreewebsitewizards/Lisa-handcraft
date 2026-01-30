import { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Check, Star, ShieldCheck, Truck } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export function ProductDetailPage() {
  const { selectedProductId, getProductById, setCurrentPage, addToCart } = useApp();
  const product = selectedProductId ? getProductById(selectedProductId) : null;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [variantOptions, setVariantOptions] = useState<Record<string, string>>({});
  const [personalization, setPersonalization] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="text-primary hover:underline font-serif italic"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const allVariantsSelected = product.variants?.every((variant) => variantOptions[variant.id]);
    
    if (product.variants && product.variants.length > 0 && !allVariantsSelected) {
      alert('Please select all options');
      return;
    }

    addToCart({
      productId: product.id,
      variantOptions,
      personalization: personalization.trim() || undefined,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group"
        >
          <div className="bg-secondary p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="font-medium">Back to Shop</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-secondary rounded-3xl overflow-hidden mb-6 shadow-lg border border-pink-50 relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {product.isMadeToOrder && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                  Made to Order
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-primary ring-2 ring-primary/20 scale-95' 
                        : 'border-transparent hover:border-pink-200 hover:scale-105'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-secondary">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              
              {!product.inStock && (
                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-bold">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="bg-green-50 p-2 rounded-full text-green-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                Quality Guaranteed
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                  <Truck className="h-4 w-4" />
                </div>
                Careful Shipping
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 space-y-6">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <label className="block mb-3 font-bold text-foreground text-sm uppercase tracking-wide">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            setVariantOptions((prev) => ({
                              ...prev,
                              [variant.id]: option,
                            }))
                          }
                          className={`px-6 py-3 rounded-full border transition-all duration-300 font-medium ${
                            variantOptions[variant.id] === option
                              ? 'border-primary bg-primary text-white shadow-lg shadow-pink-500/20'
                              : 'border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Personalization */}
            {product.allowsPersonalization && (
              <div className="mb-8 bg-secondary/30 p-6 rounded-2xl border border-secondary">
                <label className="block mb-3 flex items-center gap-2 font-bold text-foreground">
                  <Heart className="h-4 w-4 text-primary fill-primary" />
                  Personalization (Optional)
                </label>
                <input
                  type="text"
                  value={personalization}
                  onChange={(e) => setPersonalization(e.target.value)}
                  placeholder="Enter custom text (e.g., name)"
                  className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-2 ml-1">
                  Add a personal touch with a custom name or message (max 50 chars)
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.inStock || addedToCart}
              className={`w-full py-5 rounded-full flex items-center justify-center gap-3 transition-all duration-300 text-lg font-bold shadow-xl ${
                addedToCart
                  ? 'bg-green-500 text-white shadow-green-500/30'
                  : product.inStock
                  ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-pink-500/40'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="h-6 w-6" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </motion.button>

            {product.isMadeToOrder && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                * This item is handmade to order. Please allow extra time for crafting.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
