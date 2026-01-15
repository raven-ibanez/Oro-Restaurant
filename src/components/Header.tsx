import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 glass-morphism border-b border-oro-gold/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onMenuClick}
            className="flex items-center space-x-3 text-oro-dark hover:text-oro-orange transition-colors duration-300"
          >
            {loading ? (
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <img
                src={siteSettings?.site_logo || "/logo.jpg"}
                alt={siteSettings?.site_name || "Oro Restaurant"}
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-oro-gold shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-serif font-bold leading-tight tracking-tight">
                {loading ? (
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                ) : (
                  "ORO"
                )}
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-oro-orange -mt-1">
                RESTAURANT
              </span>
            </div>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative p-2.5 text-oro-dark hover:text-white hover:bg-oro-orange rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-oro-gold text-oro-dark font-bold text-[10px] rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle border border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;