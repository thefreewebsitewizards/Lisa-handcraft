import { ShoppingCart, Home, Store, Info, Mail, Settings } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export function Navigation() {
  const { currentPage, setCurrentPage, getCartCount } = useApp();
  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          {/* Logo - Left */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
            >
              <span className="text-2xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:from-accent group-hover:to-primary transition-all duration-500">
                Lisa's Handmade Gifts
              </span>
            </button>
          </div>
            
          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center gap-2 text-base font-medium transition-all hover:-translate-y-0.5 ${
                currentPage === 'home' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            
            <button
              onClick={() => setCurrentPage('shop')}
              className={`flex items-center gap-2 text-base font-medium transition-all hover:-translate-y-0.5 ${
                currentPage === 'shop' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Store className="h-4 w-4" />
              Shop
            </button>
            
            <button
              onClick={() => setCurrentPage('about')}
              className={`flex items-center gap-2 text-base font-medium transition-all hover:-translate-y-0.5 ${
                currentPage === 'about' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Info className="h-4 w-4" />
              About
            </button>
            
            <button
              onClick={() => setCurrentPage('contact')}
              className={`flex items-center gap-2 text-base font-medium transition-all hover:-translate-y-0.5 ${
                currentPage === 'contact' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Mail className="h-4 w-4" />
              Contact
            </button>
          </div>
          
          {/* Icons - Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors group"
            >
              <ShoppingCart className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setCurrentPage('admin')}
              className="p-2 hover:bg-secondary rounded-full transition-colors group"
            >
              <Settings className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden flex gap-4 py-3 overflow-x-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
              currentPage === 'home' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('shop')}
            className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
              currentPage === 'shop' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
              currentPage === 'about' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setCurrentPage('contact')}
            className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
              currentPage === 'contact' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
