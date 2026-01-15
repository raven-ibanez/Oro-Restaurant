import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 glass-morphism border-b border-oro-gold/20 shadow-sm hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex space-x-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 w-24 bg-gray-200/50 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative group pb-1 ${selectedCategory === 'all'
                    ? 'text-oro-orange'
                    : 'text-gray-400 hover:text-oro-dark'
                  }`}
              >
                All
                {selectedCategory === 'all' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-oro-orange animate-width-full" />
                )}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative group pb-1 ${selectedCategory === c.id
                      ? 'text-oro-orange'
                      : 'text-gray-400 hover:text-oro-dark'
                    }`}
                >
                  {c.name}
                  {selectedCategory === c.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-oro-orange animate-width-full" />
                  )}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-oro-orange transition-all duration-500 group-hover:w-full" />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


