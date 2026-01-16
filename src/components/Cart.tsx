import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-24">
          <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-oro-gold/50" />
          <h2 className="text-2xl font-playfair font-medium text-black mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={onContinueShopping}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-200"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-oro-dark hover:text-oro-orange transition-all duration-300 group"
        >
          <div className="p-2 bg-white rounded-full border border-oro-gold/20 shadow-sm group-hover:shadow-md">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-bold text-xs uppercase tracking-widest">Back to Menu</span>
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-oro-dark">Your Selection</h1>
          <div className="w-12 h-0.5 bg-oro-gold mx-auto mt-2" />
        </div>
        <button
          onClick={clearCart}
          className="text-gray-400 hover:text-oro-orange text-xs font-bold uppercase tracking-widest transition-colors duration-300"
        >
          Reset Selection
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl premium-shadow overflow-hidden mb-8 border border-oro-gold/10">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-oro-gold/10' : ''} hover:bg-oro-cream/10 transition-colors duration-300`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-oro-dark mb-2 tracking-tight">{item.name}</h3>
                <div className="space-y-1">
                  {item.selectedVariation && (
                    <div className="flex items-center text-xs text-oro-orange font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-oro-orange rounded-full mr-2 opacity-50" />
                      Serving: {item.selectedVariation.name}
                    </div>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <div className="flex items-start text-xs text-gray-500 font-medium">
                      <span className="w-1.5 h-1.5 bg-oro-gold rounded-full mr-2 mt-1 opacity-50 flex-shrink-0" />
                      <span>
                        Enhancements: {item.selectedAddOns.map(addOn =>
                          addOn.quantity && addOn.quantity > 1
                            ? `${addOn.name} (x${addOn.quantity})`
                            : addOn.name
                        ).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8">
                <div className="flex items-center space-x-4 bg-oro-cream rounded-full px-3 py-1.5 border border-oro-gold/10 shadow-inner">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-white rounded-full transition-all duration-300 text-oro-orange"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-serif font-bold text-oro-dark min-w-[24px] text-center text-lg">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 hover:bg-white rounded-full transition-all duration-300 text-oro-orange"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-2xl font-serif font-bold text-oro-dark">₱{(item.totalPrice * item.quantity).toFixed(0)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">₱{item.totalPrice.toFixed(0)} / unit</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2.5 text-gray-300 hover:text-oro-orange hover:bg-oro-orange/5 rounded-full transition-all duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-oro-dark rounded-2xl shadow-2xl p-10 text-white relative overflow-hidden group">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-oro-orange/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-oro-gold/10 rounded-full blur-2xl -ml-24 -mb-24" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
            <div>
              <span className="text-oro-gold font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">Grand Estimate</span>
              <span className="text-2xl font-serif font-bold">Total Amount</span>
            </div>
            <div className="text-right">
              <span className="text-4xl md:text-5xl font-serif font-bold text-oro-gold">₱{(getTotalPrice() || 0).toFixed(0)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-oro-orange text-white py-5 rounded-xl hover:bg-oro-gold hover:text-oro-dark transition-all duration-500 font-serif font-bold text-xl uppercase tracking-widest shadow-xl transform active:scale-[0.98]"
          >
            Initiate Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;