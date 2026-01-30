import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { motion } from 'motion/react';

export function CartPage() {
  const { cart, getProductById, removeFromCart, updateCartQuantity, getCartTotal, clearCart, setCurrentPage } = useApp();

  const handleCheckout = () => {
    alert('Checkout functionality will be connected to a payment provider in production!');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 rounded-3xl bg-secondary/30 border border-secondary"
        >
          <div className="bg-white p-4 rounded-full inline-block mb-6 shadow-sm">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-serif text-foreground mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Looks like you haven't added any handmade treasures yet.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item, index) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <motion.div
                  key={`${item.productId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-secondary hover:shadow-md transition-shadow flex gap-6 items-start"
                >
                  <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif font-bold truncate pr-4">{product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantOptions)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-1 mb-4">
                      {Object.keys(item.variantOptions).length > 0 && (
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          {Object.entries(item.variantOptions).map(([key, value]) => (
                            <span key={key} className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.personalization && (
                        <div className="text-sm text-primary italic">
                          "{item.personalization}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variantOptions, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors shadow-sm disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variantOptions, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xl font-bold text-foreground">${(product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl border border-secondary p-8 shadow-lg sticky top-24">
              <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-sm italic">Calculated at checkout</span>
                </div>
                <div className="border-t border-secondary pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-muted-foreground text-sm hover:text-destructive transition-colors"
              >
                Clear Shopping Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
