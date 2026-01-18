import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  quantity,
  onUpdateQuantity
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn =>
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      if (quantity === 0) return prev.filter(a => a.id !== addOn.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-oro-gold/10 ${!item.available ? 'opacity-60' : ''}`}>
        <div className="flex items-center p-3 gap-4">
          {/* Image Section */}
          <div className="relative h-20 w-20 flex-shrink-0 bg-oro-cream rounded-lg overflow-hidden group-hover:shadow-inner transition-all duration-500">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 filter grayscale">
                <span className="font-serif font-bold text-oro-gold text-lg tracking-widest opacity-20">ORO</span>
              </div>
            )}

            {/* Minimal overlays for horizontal design */}
            {!item.available && (
              <div className="absolute inset-0 bg-oro-dark/40 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Sold Out</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-base font-serif font-bold text-oro-dark leading-tight line-clamp-1 group-hover:text-oro-orange transition-colors duration-300">
                {item.name}
              </h4>
              <p className={`text-xs leading-tight font-sans line-clamp-1 mb-1 ${!item.available ? 'text-gray-400 font-light' : 'text-gray-600 font-light'}`}>
                {!item.available ? 'Currently unavailable' : item.description}
              </p>

              <div className="flex items-center gap-2">
                {item.isOnDiscount && item.discountPrice ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 line-through font-light decoration-oro-orange/30">₱{item.basePrice.toFixed(0)}</span>
                    <span className="text-sm font-bold text-oro-orange font-serif">₱{item.discountPrice.toFixed(0)}</span>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-oro-dark font-serif">₱{item.basePrice.toFixed(0)}</div>
                )}

                {/* Visual badges for popular/discount items */}
                {(item.popular || item.isOnDiscount) && (
                  <div className="flex gap-1">
                    {item.popular && <span className="w-1.5 h-1.5 rounded-full bg-oro-gold" title="Popular" />}
                    {item.isOnDiscount && <span className="w-1.5 h-1.5 rounded-full bg-oro-orange" title="Discount" />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            {!item.available ? (
              <button disabled className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1">Sold Out</button>
            ) : quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="h-8 px-4 bg-transparent text-oro-dark border border-oro-dark/10 rounded-full transition-all duration-300 hover:bg-oro-dark hover:text-white hover:shadow-md active:scale-95"
              >
                <span className="font-bold text-[10px] uppercase tracking-widest">{item.variations?.length || item.addOns?.length ? 'Customize' : 'Add'}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-oro-cream/50 rounded-full px-1.5 py-1 border border-oro-gold/10">
                <button
                  onClick={handleDecrement}
                  className="p-1 hover:bg-white rounded-full transition-all duration-300 text-oro-orange"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="font-bold text-oro-dark min-w-[14px] text-center font-serif text-xs">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="p-1 hover:bg-white rounded-full transition-all duration-300 text-oro-orange"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCustomization && (
        <div className="fixed inset-0 bg-oro-dark/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl premium-shadow border border-oro-gold/20">
            <div className="sticky top-0 bg-white border-b border-oro-gold/10 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-2xl font-serif font-bold text-oro-dark">Customize Selection</h3>
                <p className="text-sm text-oro-orange font-medium uppercase tracking-widest mt-1">{item.name}</p>
              </div>
              <button onClick={() => setShowCustomization(false)} className="p-2 hover:bg-oro-cream rounded-full transition-all duration-300">
                <X className="h-6 w-6 text-oro-dark" />
              </button>
            </div>

            <div className="p-6">
              {item.variations && item.variations.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-serif font-bold text-lg text-oro-dark mb-4">Select Serving Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label key={variation.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-300 ${selectedVariation?.id === variation.id ? 'border-oro-orange bg-oro-cream ring-1 ring-oro-orange' : 'border-oro-gold/20 hover:border-oro-orange/50 hover:bg-oro-cream/30'}`}>
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="variation" checked={selectedVariation?.id === variation.id} onChange={() => setSelectedVariation(variation)} className="w-5 h-5 text-oro-orange focus:ring-oro-orange" />
                          <span className="font-medium text-oro-dark">{variation.name}</span>
                        </div>
                        <span className="text-oro-dark font-bold font-serif">₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(0)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-8">
                  <h4 className="font-serif font-bold text-lg text-oro-dark mb-4">Enhance Your Dish</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-6">
                      <h5 className="text-xs font-bold text-oro-orange uppercase tracking-[0.2em] mb-3">{category.replace('-', ' ')}</h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div key={addOn.id} className="flex items-center justify-between p-4 border border-oro-gold/10 rounded-xl hover:bg-oro-cream/20 transition-all duration-300">
                            <div className="flex-1">
                              <span className="font-medium text-oro-dark block">{addOn.name}</span>
                              <span className="text-xs text-gray-500">{addOn.price > 0 ? `+ ₱${addOn.price.toFixed(0)}` : 'Complimentary'}</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-oro-cream rounded-full px-2 py-1 border border-oro-gold/10">
                              <button type="button" onClick={() => {
                                const current = selectedAddOns.find(a => a.id === addOn.id);
                                updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                              }} className="p-1.5 hover:bg-white rounded-full text-oro-orange transition-all"><Minus className="h-3 w-3" /></button>
                              <span className="font-bold text-oro-dark text-sm min-w-[20px] text-center">{selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}</span>
                              <button type="button" onClick={() => {
                                const current = selectedAddOns.find(a => a.id === addOn.id);
                                updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                              }} className="p-1.5 hover:bg-white rounded-full text-oro-orange transition-all"><Plus className="h-3 w-3" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="sticky bottom-0 bg-white pt-4 border-t border-oro-gold/10 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-serif font-bold text-oro-dark uppercase tracking-widest">Total Price</span>
                  <span className="text-3xl font-serif font-bold text-oro-orange">₱{calculatePrice().toFixed(0)}</span>
                </div>
                <button onClick={handleCustomizedAddToCart} className="w-full h-14 bg-oro-dark text-white rounded-full hover:bg-oro-orange transition-all duration-300 font-bold uppercase tracking-widest shadow-xl flex items-center justify-center space-x-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Confirm and Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;