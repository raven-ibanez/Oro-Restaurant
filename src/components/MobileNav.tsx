import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-20 z-40 glass-morphism border-b border-oro-gold/20 md:hidden shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center px-6 py-3 rounded-full mr-3 transition-all duration-300 border ${activeCategory === category.id
              ? 'bg-oro-orange text-white border-oro-orange shadow-lg scale-105'
              : 'bg-white text-oro-dark border-oro-gold/20 hover:border-oro-orange active:scale-95'
              }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;