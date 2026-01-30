import { ArrowRight, Gift, Heart, Sparkles, Star } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'motion/react';

export function HomePage() {
  const { setCurrentPage, products, setSelectedProductId } = useApp();

  const featuredProducts = products.slice(0, 6); // Show more products for Masonry effect
  const categories = [
    {
      name: 'Drinkware',
      description: 'Custom tumblers',
      icon: Sparkles,
      filter: 'drinkware' as const,
    },
    {
      name: 'Personalized',
      description: 'Make it yours',
      icon: Heart,
      filter: 'personalized' as const,
    },
    {
      name: 'Wall Decor',
      description: 'Handcrafted plaques',
      icon: Gift,
      filter: 'home-decor' as const,
    },
  ];

  const marqueeText = "Custom Made • Personalized Gifts • Handcrafted with Love • ";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Hero Section - Parallax & Full Height */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/30" /> {/* Slight darkening for readability */}
        </div>

        {/* Content with Glassmorphism */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 p-12 rounded-3xl shadow-2xl"
          >
            <h1 className="text-5xl md:text-8xl mb-6 font-serif font-bold text-white drop-shadow-lg tracking-tight">
              Handmade <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white">Luxury</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/90 mb-10 font-light max-w-3xl mx-auto leading-relaxed">
              Elevate your gifting with our premium, custom-crafted collection.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(233, 30, 99, 0.4)", "0 0 0 20px rgba(233, 30, 99, 0)"]
              }}
              transition={{ 
                boxShadow: { duration: 1.5, repeat: Infinity }
              }}
              onClick={() => setCurrentPage('shop')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white px-12 py-5 rounded-full font-bold text-xl shadow-lg hover:shadow-pink-500/50 transition-all"
            >
              Shop Collection
              <ArrowRight className="h-6 w-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section - Pure White */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4 font-serif text-header">Curated Categories</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.filter}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setCurrentPage('shop')}
                  className="relative overflow-hidden bg-secondary rounded-2xl p-10 hover:shadow-xl transition-all duration-300 text-left group border border-transparent hover:border-pink-100"
                >
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-pink-100 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="relative z-10">
                    <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md transition-shadow">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-3xl mb-3 font-serif text-header group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-muted-foreground text-lg mb-6">{category.description}</p>
                    <div className="flex items-center text-primary font-bold gap-2 group-hover:gap-4 transition-all">
                      Explore
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products (Masonry) - Blush Pink Background */}
      <section className="py-24 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 px-2"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-header mb-2">Latest Creations</h2>
              <p className="text-primary font-medium text-lg">Handpicked for you</p>
            </div>
            <button 
              onClick={() => setCurrentPage('shop')}
              className="hidden md:flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
          >
            <Masonry gutter="2rem">
              {featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Glassmorphism Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                       <button
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setCurrentPage('product');
                        }}
                        className="bg-white/90 backdrop-blur-md text-primary px-8 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white"
                      >
                        View Details
                      </button>
                    </div>
                    
                    {index === 0 && (
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        Best Seller
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif text-header line-clamp-2 leading-tight">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                      {product.allowsPersonalization && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-3 py-1 rounded-full">
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
        </div>
      </section>

      {/* About Section - White Background */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-100 to-transparent rounded-3xl -z-10 rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80" 
              alt="Artisan at work" 
              className="rounded-2xl shadow-xl w-full"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl mb-8 font-serif text-header">Crafted with Heart</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Every item in our store is a labor of love. We believe in the power of handmade to tell a story. 
              Specializing in custom tumblers, wall decor, and personalized gifts, we bring your vision to life.
            </p>
            <ul className="space-y-4 mb-10">
              {['Sustainably Sourced Materials', 'Handcrafted in Small Batches', 'Quality Guaranteed'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-lg font-medium text-foreground">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Star className="h-4 w-4 text-green-600 fill-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setCurrentPage('about')}
              className="border-2 border-primary text-primary px-10 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg"
            >
              Read Our Story
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
