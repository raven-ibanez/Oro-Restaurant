import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);

      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <MobileNav
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="text-center mb-20 animate-slide-up">
          <span className="text-oro-orange font-bold uppercase tracking-[0.3em] text-xs mb-3 block">Selection</span>
          <h2 className="text-3xl md:text-6xl font-serif font-bold text-oro-dark mb-6 tracking-tight">Our Culinary Offerings</h2>
          <p className="text-gray-500 max-w-3xl mx-auto font-sans font-light text-lg leading-relaxed">
            Experience the gold standard of Filipino gastronomy. From our signature meat dishes to our delicate noodles,
            each plate is a masterpiece of tradition and refined taste.
          </p>
          <div className="w-24 h-1 bg-oro-gold mx-auto mt-10" />
        </div>

        {categories.map((category) => {
          const categoryItems = menuItems.filter(item => item.category === category.id);

          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-24 scroll-mt-32">
              <div className="flex items-center justify-between mb-10 border-b border-oro-gold/10 pb-6">
                <div className="flex items-center">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-oro-dark tracking-tight">{category.name}</h3>
                </div>
                <div className="hidden md:block text-xs font-bold text-oro-orange uppercase tracking-widest bg-oro-cream px-4 py-2 rounded-full border border-oro-gold/20">
                  {categoryItems.length} {categoryItems.length === 1 ? 'Dish' : 'Dishes'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryItems.map((item) => {
                  const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                  return (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                      quantity={cartItem?.quantity || 0}
                      onUpdateQuantity={updateQuantity}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
};

export default Menu;