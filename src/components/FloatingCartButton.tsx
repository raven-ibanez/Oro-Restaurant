import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-8 right-8 bg-oro-dark text-white p-5 rounded-full shadow-2xl hover:bg-oro-orange transition-all duration-500 transform hover:scale-110 z-40 md:hidden border border-oro-gold/20"
    >
      <div className="relative">
        <ShoppingCart className="h-7 w-7" />
        <span className="absolute -top-3 -right-3 bg-oro-gold text-oro-dark text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md border border-oro-dark/10">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;