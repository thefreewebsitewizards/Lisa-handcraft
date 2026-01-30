import { useState } from 'react';
import { Heart, Filter, Sparkles } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';

export function ShopPage() {
  const { products, setSelectedProductId, setCurrentPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts =
    selectedCategory === 'all' ? products : products.filter((p) => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'drinkware', label: 'Drinkware' },
    { id: 'personalized', label: 'Personalized' },
    { id: 'home-decor', label: 'Wall Decor' },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif text-foreground mb-6">
            Curated <span className="text-primary italic">Collections</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive range of handcrafted treasures, made with passion and precision.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div className="flex flex-wrap justify-center gap-4 bg-secondary/50 backdrop-blur-sm p-2 rounded-full border border-pink-100">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg shadow-pink-500/30 scale-105'
                    : 'bg-transparent text-muted-foreground hover:bg-white hover:text-primary'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid - Masonry */}
        <ResponsiveMasonry
          columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1200: 4}}
        >
          <Masonry gutter="2rem">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-transparent hover:border-pink-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setCurrentPage('product');
                      }}
                      className="bg-white/90 backdrop-blur-md text-primary px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white shadow-lg"
                    >
                      View Details
                    </button>
                  </div>

                  {product.isMadeToOrder && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Made to Order
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-secondary">
                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                    {product.allowsPersonalization && (
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                        <Heart className="h-3 w-3 text-primary fill-primary" />
                        Personalizable
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <div className="bg-secondary/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Filter className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-serif text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
