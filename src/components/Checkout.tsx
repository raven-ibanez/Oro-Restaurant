import React, { useState } from 'react';
import { ArrowLeft, Clock, ShoppingCart } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup'
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';

    const dineInInfo = serviceType === 'dine-in'
      ? `Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\nPreferred Time: ${new Date(dineInTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
      : '';

    const orderDetails = `
ORO RESTAURANT — PREMIUM SELECTION

GUEST: ${customerName}
CONTACT: ${contactNumber}
SERVICE: ${serviceType.toUpperCase()}
${serviceType === 'delivery' ? `ADDRESS: ${address}${landmark ? `\nLANDMARK: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `PICKUP TIME: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


RESERVED SELECTIONS:
${cartItems.map(item => {
      let itemDetails = `• ${item.name.toUpperCase()}`;
      if (item.selectedVariation) {
        itemDetails += ` [${item.selectedVariation.name}]`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} (x${addOn.quantity})`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} — ₱${(item.totalPrice * item.quantity).toFixed(0)}`;
      return itemDetails;
    }).join('\n')}

TOTAL INVESTMENT: ₱${totalPrice.toFixed(0)}

PAYMENT METHOD: ${selectedPaymentMethod?.name || paymentMethod}
PROOF OF PAYMENT: [Please attach screenshot here]

${notes ? `SPECIAL REQUESTS: ${notes}` : ''}

Thank you for choosing Oro Restaurant. We are preparing your exquisite meal.
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/orofoodhouse?text=${encodedMessage}`;

    window.open(messengerUrl, '_blank');

  };

  const isDetailsValid = customerName && contactNumber &&
    (serviceType !== 'delivery' || address) &&
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center space-x-6">
            <button
              onClick={onBack}
              className="p-3 bg-white rounded-full border border-oro-gold/20 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <ArrowLeft className="h-6 w-6 text-oro-dark group-hover:text-oro-orange" />
            </button>
            <div>
              <h1 className="text-4xl font-serif font-bold text-oro-dark">Order Finalization</h1>
              <div className="w-12 h-1 bg-oro-orange mt-2" />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-oro-orange">
            <div className="w-3 h-3 bg-oro-orange rounded-full" />
            <div className="w-20 h-0.5 bg-oro-gold/30" />
            <div className="w-3 h-3 bg-oro-gold/30 rounded-full" />
            <span className="text-xs font-bold uppercase tracking-widest ml-4">Step 1 of 2</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-oro-dark rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-oro-orange/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <h2 className="text-2xl font-serif font-bold mb-6 md:mb-8 border-b border-white/10 pb-4 relative z-10">Selection Summary</h2>

              <div className="space-y-6 mb-8 relative z-10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex-1">
                      <h4 className="font-serif font-medium text-oro-gold leading-tight mb-1">{item.name}</h4>
                      <div className="text-xs text-white/50 uppercase tracking-widest">
                        {item.quantity} {item.quantity === 1 ? 'Unit' : 'Units'} {item.selectedVariation ? `• ${item.selectedVariation.name}` : ''}
                      </div>
                    </div>
                    <span className="font-serif font-bold text-lg">₱{(item.totalPrice * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold">Total Estimate</span>
                </div>
                <div className="text-4xl font-serif font-bold text-oro-orange">
                  ₱{totalPrice.toFixed(0)}
                </div>
              </div>
            </div>

            <div className="bg-oro-cream/50 border border-oro-gold/20 rounded-2xl p-6 text-center">
              <p className="text-xs text-gray-500 font-medium italic">
                "Oro Restaurant — Where every bite is worth its weight in gold."
              </p>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl premium-shadow border border-oro-gold/10 p-6 md:p-10">
            <h2 className="text-2xl font-serif font-bold text-oro-dark mb-10 border-b border-oro-gold/10 pb-4">Guest Information</h2>

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em] ml-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-6 py-4 bg-oro-cream/30 border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange focus:border-oro-orange outline-none transition-all duration-300 font-medium"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em] ml-1">Contact Number</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-6 py-4 bg-oro-cream/30 border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange focus:border-oro-orange outline-none transition-all duration-300 font-medium"
                    placeholder="0917 XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em] ml-1">Preferred Service</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'dine-in', label: 'Dine In' },
                    { value: 'pickup', label: 'Pickup' },
                    { value: 'delivery', label: 'Delivery' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-6 rounded-xl border-2 transition-all duration-500 group ${serviceType === option.value
                        ? 'border-oro-orange bg-oro-orange text-white shadow-lg'
                        : 'border-oro-gold/10 bg-white text-oro-dark hover:border-oro-orange/50'
                        }`}
                    >
                      <div className="text-sm font-bold uppercase tracking-widest">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Specific Fields */}
              <div className="bg-oro-cream/20 rounded-2xl p-8 border border-oro-gold/10 animate-slide-up">
                {serviceType === 'dine-in' && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em]">Guest Count</label>
                      <div className="flex items-center space-x-8">
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.max(1, partySize - 1))}
                          className="w-12 h-12 rounded-full border border-oro-gold/30 flex items-center justify-center text-oro-dark hover:bg-oro-orange hover:text-white hover:border-oro-orange transition-all duration-300"
                        >
                          -
                        </button>
                        <span className="text-4xl font-serif font-bold text-oro-dark min-w-[3rem] text-center">{partySize}</span>
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.min(20, partySize + 1))}
                          className="w-12 h-12 rounded-full border border-oro-gold/30 flex items-center justify-center text-oro-dark hover:bg-oro-orange hover:text-white hover:border-oro-orange transition-all duration-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em]">Reservation Time</label>
                      <input
                        type="datetime-local"
                        value={dineInTime}
                        onChange={(e) => setDineInTime(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange outline-none transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                )}

                {serviceType === 'pickup' && (
                  <div className="space-y-6">
                    <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em]">Estimated Arrival</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: '5-10', label: 'Quick Prep' },
                        { value: '15-20', label: 'Standard' },
                        { value: '25-30', label: 'Relaxed' },
                        { value: 'custom', label: 'Specify Time' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPickupTime(option.value)}
                          className={`p-4 rounded-xl border transition-all duration-300 text-xs font-bold uppercase tracking-widest ${pickupTime === option.value
                            ? 'bg-oro-dark text-white border-oro-dark shadow-md'
                            : 'bg-white text-oro-dark border-oro-gold/20 hover:border-oro-orange'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {pickupTime === 'custom' && (
                      <input
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange outline-none mt-4"
                        placeholder="e.g., 4:30 PM"
                      />
                    )}
                  </div>
                )}

                {serviceType === 'delivery' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em]">Full Address</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange outline-none h-32"
                        placeholder="Please provide complete address for accurate delivery"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em]">Landmark</label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange outline-none"
                        placeholder="Near specific establishments"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-oro-orange uppercase tracking-[.2em]">Special Requests</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-6 py-4 bg-oro-cream/30 border border-oro-gold/20 rounded-xl focus:ring-1 focus:ring-oro-orange outline-none h-24"
                  placeholder="Allergies, table preferences, or specific instructions..."
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-5 rounded-full font-serif font-bold text-xl uppercase tracking-widest transition-all duration-500 shadow-xl ${isDetailsValid
                  ? 'bg-oro-dark text-white hover:bg-oro-orange active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setStep('details')}
            className="p-3 bg-white rounded-full border border-oro-gold/20 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <ArrowLeft className="h-6 w-6 text-oro-dark group-hover:text-oro-orange" />
          </button>
          <div>
            <h1 className="text-4xl font-serif font-bold text-oro-dark">Settlement</h1>
            <div className="w-12 h-1 bg-oro-orange mt-2" />
          </div>
        </div>
        <div className="flex items-center space-x-2 text-oro-orange">
          <div className="w-3 h-3 bg-oro-gold/30 rounded-full" />
          <div className="w-20 h-0.5 bg-oro-orange" />
          <div className="w-3 h-3 bg-oro-orange rounded-full shadow-[0_0_10px_rgba(230,104,30,0.5)]" />
          <span className="text-xs font-bold uppercase tracking-widest ml-4">Step 2 of 2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl premium-shadow border border-oro-gold/10 p-10">
            <h2 className="text-2xl font-serif font-bold text-oro-dark mb-8 border-b border-oro-gold/10 pb-4">Secure Payment Method</h2>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-500 flex items-center justify-between group ${paymentMethod === method.id
                    ? 'border-oro-orange bg-oro-cream/30'
                    : 'border-oro-gold/10 bg-white hover:border-oro-orange/30'
                    }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-xl transition-colors duration-500 ${paymentMethod === method.id ? 'bg-oro-orange text-white' : 'bg-oro-cream text-oro-orange'}`}>
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-oro-orange uppercase tracking-widest mb-1">Standard</span>
                      <span className="text-lg font-serif font-bold text-oro-dark tracking-tight">{method.name}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${paymentMethod === method.id ? 'border-oro-orange bg-oro-orange' : 'border-oro-gold/30'}`}>
                    {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>

            {selectedPaymentMethod && (
              <div className="bg-oro-dark rounded-2xl p-8 text-white relative overflow-hidden animate-slide-up shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-oro-orange/20 rounded-full blur-2xl -mr-16 -mt-16" />
                <h3 className="font-serif font-bold text-lg mb-6 text-oro-gold border-b border-white/10 pb-4">Payment Information</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] block mb-1">Account Provider</span>
                      <p className="font-serif text-xl">{selectedPaymentMethod.name}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] block mb-1">Account Identifier</span>
                      <p className="font-mono text-2xl font-bold text-oro-gold tracking-tight">{selectedPaymentMethod.account_number}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] block mb-1">Account Holder</span>
                      <p className="font-medium text-white/80">{selectedPaymentMethod.account_name}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img
                      src={selectedPaymentMethod.qr_code_url}
                      alt="QR Code"
                      className="w-40 h-40 rounded-xl"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Scan+QR'; }}
                    />
                    <p className="text-[8px] text-oro-dark font-bold text-center mt-2 uppercase tracking-widest">Instant Settlement</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-oro-cream/50 border border-oro-orange/20 rounded-2xl p-6 flex items-start space-x-6 shadow-inner animate-pulse">
            <div className="p-3 bg-oro-orange/10 rounded-full text-oro-orange">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-oro-dark mb-1">Notice of Verification</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                To maintain our standards of excellence, please capture a digital snapshot of your transaction receipt.
                You will be requested to provide this during order confirmation via our premium messaging portal.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl premium-shadow border border-oro-gold/10 p-10">
            <h2 className="text-2xl font-serif font-bold text-oro-dark mb-8 border-b border-oro-gold/10 pb-4">Order Confirmation</h2>

            <div className="space-y-8 mb-10">
              <div className="bg-oro-cream/30 rounded-2xl p-6 space-y-4 border border-oro-gold/10">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-oro-orange uppercase tracking-widest">Guest Context</span>
                  <div className="text-right">
                    <p className="font-serif font-bold text-oro-dark">{customerName}</p>
                    <p className="text-xs text-gray-500">{serviceType.toUpperCase()} SELECTION</p>
                  </div>
                </div>
                {serviceType === 'dine-in' && (
                  <div className="flex justify-between items-center border-t border-oro-gold/5 pt-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Appointment</span>
                    <span className="font-serif font-bold text-xs">{dineInTime ? new Date(dineInTime).toLocaleString() : 'Pending'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-6 py-4 border-b border-oro-gold/5 last:border-0">
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-oro-dark leading-tight mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        {item.quantity} UNIT{item.quantity > 1 ? 'S' : ''} {item.selectedVariation ? `[${item.selectedVariation.name}]` : ''}
                      </p>
                    </div>
                    <span className="font-serif font-bold text-oro-orange">₱{(item.totalPrice * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-oro-gold/10 mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Total Investment</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-5xl font-serif font-bold text-oro-dark">₱{totalPrice.toFixed(0)}</span>
                <span className="text-xs text-oro-orange font-bold uppercase tracking-widest mb-2">VAT Inclusive</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-6 rounded-full font-serif font-bold text-xl uppercase tracking-widest transition-all duration-700 bg-oro-orange text-white hover:bg-oro-gold hover:text-oro-dark shadow-2xl relative overflow-hidden group active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center justify-center space-x-4">
                <span>Authorize via Messenger</span>
              </span>
            </button>

            <p className="text-xs text-gray-400 font-bold text-center mt-6 uppercase tracking-[0.2em] leading-relaxed">
              Redirecting to secure messaging for identity verification and order processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;