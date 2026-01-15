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
      <div className={`bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-scale-in border border-oro-gold/10 ${!item.available ? 'opacity-60' : ''}`}>
        <div className="relative h-56 bg-gradient-to-br from-oro-cream to-white overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 filter grayscale">
            <span className="font-serif font-bold text-oro-gold text-4xl tracking-widest opacity-20">ORO</span>
          </div>

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-oro-orange text-white text-xs font-bold tracking-widest px-3 py-1.5 rounded-sm shadow-lg uppercase">Special Offer</div>
            )}
            {item.popular && (
              <div className="bg-oro-gold text-oro-dark text-xs font-bold tracking-widest px-3 py-1.5 rounded-sm shadow-lg uppercase">Chef's Selection</div>
            )}
          </div>

          {!item.available && (
            <div className="absolute top-4 right-4 bg-oro-dark text-white text-xs font-bold tracking-widest px-3 py-1.5 rounded-sm shadow-lg uppercase">Sold Out</div>
          )}
          <div className="absolute inset-0 bg-oro-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-xl font-serif font-bold text-oro-dark leading-tight flex-1 pr-2 tracking-tight group-hover:text-oro-orange transition-colors duration-300">
              {item.name}
            </h4>
          </div>

          <p className={`text-sm mb-6 leading-relaxed font-sans line-clamp-2 min-h-[2.5rem] ${!item.available ? 'text-gray-400 font-light' : 'text-gray-600 font-light'}`}>
            {!item.available ? 'This exquisite dish is currently unavailable.' : item.description}
          </p>

          <div className="flex items-end justify-between border-t border-oro-gold/10 pt-4">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-400 line-through font-light decoration-oro-orange/30">₱{item.basePrice.toFixed(0)}</span>
                    <span className="text-2xl font-bold text-oro-orange font-serif">₱{item.discountPrice.toFixed(0)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-oro-dark font-serif">₱{item.basePrice.toFixed(0)}</div>
              )}
            </div>

            <div className="flex-shrink-0">
              {!item.available ? (
                <button disabled className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest border border-gray-200">Sold Out</button>
              ) : quantity === 0 ? (
                <button onClick={handleAddToCart} className="h-11 px-7 bg-oro-dark text-white rounded-full transition-all duration-300 hover:bg-oro-orange shadow-lg">
                  <span className="font-bold text-xs uppercase tracking-widest">{item.variations?.length || item.addOns?.length ? 'Customize' : 'Add to Plate'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3 bg-oro-cream rounded-full px-2 py-1.5 border border-oro-gold/20 shadow-inner">
                  <button onClick={handleDecrement} className="p-1.5 hover:bg-white rounded-full transition-all duration-300 text-oro-orange"><Minus className="h-4 w-4" /></button>
                  <span className="font-bold text-oro-dark min-w-[20px] text-center font-serif text-lg">{quantity}</span>
                  <button onClick={handleIncrement} className="p-1.5 hover:bg-white rounded-full transition-all duration-300 text-oro-orange"><Plus className="h-4 w-4" /></button>
                </div>
              )}
            </div>
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