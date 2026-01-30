import { AppProvider, useApp } from '@/app/context/AppContext';
import { Navigation } from '@/app/components/navigation';
import { HomePage } from '@/app/components/home-page';
import { ShopPage } from '@/app/components/shop-page';
import { ProductDetailPage } from '@/app/components/product-detail-page';
import { CartPage } from '@/app/components/cart-page';
import { AdminPage } from '@/app/components/admin-page';
import { AboutPage } from '@/app/components/about-page';
import { ContactPage } from '@/app/components/contact-page';
import { Marquee } from '@/app/components/ui/marquee';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

function AppContent() {
  const { currentPage, setCurrentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow">
        {renderPage()}
      </main>
      
      <Marquee />
      
      {/* Footer */}
      <footer className="bg-secondary border-t border-pink-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Lisa's Handmade</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Crafting memories, one personalized gift at a time. Made with love and attention to detail.
              </p>
              <div className="flex gap-4">
                <button className="p-2 bg-white rounded-full shadow-sm hover:text-primary hover:shadow-md transition-all">
                  <Instagram className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm hover:text-primary hover:shadow-md transition-all">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm hover:text-primary hover:shadow-md transition-all">
                  <Twitter className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-lg mb-6 text-foreground">Shop</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">All Products</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">New Arrivals</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Best Sellers</button></li>
                <li><button onClick={() => setCurrentPage('shop')} className="hover:text-primary transition-colors">Personalized</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-lg mb-6 text-foreground">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-primary transition-colors">Our Story</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-primary transition-colors">Contact Us</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-primary transition-colors">FAQ</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-primary transition-colors">Shipping & Returns</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-lg mb-6 text-foreground">Newsletter</h4>
              <p className="text-muted-foreground mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:border-primary bg-white"
                />
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-pink-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 Lisa's Handmade Gifts. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-primary fill-primary" /> by Lisa Batchelor
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
