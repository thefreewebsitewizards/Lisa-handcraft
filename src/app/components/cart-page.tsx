import { useMemo, useState, type ChangeEvent } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { motion } from 'motion/react';
import { callFunction } from '@/app/firebase';
import { Input } from '@/app/components/ui/input';

type ShippingAddress = {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
};

type ShippingRate = {
  rateId: string;
  provider: string;
  carrierKey: string;
  serviceName: string;
  amount: string;
  baseAmount?: string;
  currency: string;
  estimatedDays: number | null;
  durationTerms: string;
  isMarkedUp?: boolean;
};

type OrderItem = {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  option?: string;
  note?: string;
};

const SHIPPING_MARKUP = 1.35;

const toCents = (value: number) => Math.round(value * 100);

const parseAmount = (rawAmount: string) => {
  const sanitized = rawAmount.replace(/[^0-9.]+/g, '');
  if (!sanitized) return NaN;
  return Number(sanitized);
};

const getMarkedUpAmount = (rawAmount: string) => {
  const base = parseAmount(rawAmount);
  if (!Number.isFinite(base) || base < 0) return 0;
  const baseCents = toCents(base);
  const markedUpCents = Math.round(baseCents * SHIPPING_MARKUP);
  return markedUpCents / 100;
};

const getDisplayAmount = (rate: ShippingRate) => {
  const baseSource = rate.baseAmount ?? rate.amount;
  const markedUp = getMarkedUpAmount(baseSource);
  const parsed = parseAmount(rate.amount);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed > markedUp ? parsed : markedUp;
  }
  return markedUp;
};

const getFunctionErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== 'object') return fallback;
  const record = error as { message?: unknown; details?: unknown };
  const message = typeof record.message === 'string' ? record.message : '';
  if (record.details && typeof record.details === 'object') {
    const details = record.details as { message?: unknown; error?: unknown };
    const detailsMessage = typeof details.message === 'string' ? details.message : '';
    const detailsError = typeof details.error === 'string' ? details.error : '';
    if (detailsMessage) return detailsMessage;
    if (detailsError) return detailsError;
  }
  return message || fallback;
};

export function CartPage() {
  const { cart, getProductById, removeFromCart, updateCartQuantity, getCartTotal, clearCart, setCurrentPage, storeId } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    company: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    email: '',
  });
  const [shipmentId, setShipmentId] = useState('');
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState('');
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const selectedRate = useMemo(
    () => shippingRates.find((rate) => rate.rateId === selectedRateId) ?? null,
    [selectedRateId, shippingRates],
  );
  const shippingAmount = selectedRate ? getDisplayAmount(selectedRate) : 0;
  const total = getCartTotal() + (Number.isFinite(shippingAmount) ? shippingAmount : 0);

  const handleShippingChange = (field: keyof ShippingAddress) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    setShippingRates([]);
    setSelectedRateId('');
    setShipmentId('');
    setShippingError(null);
  };

  const isShippingAddressComplete = useMemo(() => {
    const requiredFields: (keyof ShippingAddress)[] = [
      'name',
      'street1',
      'city',
      'state',
      'zip',
      'country',
      'phone',
      'email',
    ];
    return requiredFields.every((field) => String(shippingAddress[field] ?? '').trim().length > 0);
  }, [shippingAddress]);

  const handleFetchRates = async () => {
    if (isFetchingRates) return;
    setShippingError(null);
    if (!isShippingAddressComplete) {
      setShippingError('Please complete the shipping address to get rates.');
      return;
    }

    setIsFetchingRates(true);
    try {
      const result = await callFunction<{ shipmentId?: string; rates?: ShippingRate[] }>(
        'getShippingRatesForLisa',
        { toAddress: shippingAddress },
        storeId,
      );
      const rates = Array.isArray(result?.rates) ? result.rates : [];
      const shipmentIdValue = typeof result?.shipmentId === 'string' ? result.shipmentId : '';
      if (!shipmentIdValue || rates.length === 0) {
        throw new Error('No shipping rates available for this address.');
      }
      const sortedRates = [...rates].sort((a, b) => getDisplayAmount(a) - getDisplayAmount(b));
      setShipmentId(shipmentIdValue);
      setShippingRates(sortedRates);
      setSelectedRateId(sortedRates[0]?.rateId ?? '');
    } catch (error) {
      setShippingError(getFunctionErrorMessage(error, 'Unable to fetch shipping rates.'));
      setShippingRates([]);
      setSelectedRateId('');
      setShipmentId('');
    } finally {
      setIsFetchingRates(false);
    }
  };

  const handleCheckout = async () => {
    if (isCheckingOut) return;
    setCheckoutError(null);
    const checkoutItems = cart.items
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return {
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          imageUrl: product.images[0] ?? '',
        };
      })
      .filter(Boolean);
    if (checkoutItems.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }
    if (!isShippingAddressComplete) {
      setCheckoutError('Please provide a shipping address.');
      return;
    }
    if (!selectedRateId) {
      setCheckoutError('Please select a shipping option.');
      return;
    }
    setIsCheckingOut(true);
    try {
      const orderItems: OrderItem[] = cart.items
        .map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          const option = Object.entries(item.variantOptions || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          return {
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            imageUrl: product.images[0] ?? '',
            option: option || undefined,
            note: item.personalization || undefined,
          };
        })
        .filter(Boolean) as OrderItem[];
      const orderResponse = await callFunction<{ orderId?: string }>(
        'createOrderForLisa',
        {
          items: orderItems,
          customer: shippingAddress,
          shipping: {
            selectedRateId,
            shipmentId: shipmentId || undefined,
          },
        },
        storeId,
      );
      const orderId = typeof orderResponse?.orderId === 'string' ? orderResponse.orderId : '';
      if (!orderId) {
        throw new Error('Unable to create order.');
      }
      const origin = window.location.origin;
      const response = await callFunction<{ url?: string }>(
        'createCheckoutSessionForLisa',
        {
          items: checkoutItems,
          successUrl: `${origin}/?checkout=success`,
          cancelUrl: `${origin}/?checkout=cancel`,
          orderId,
        },
        storeId,
      );
      if (response?.url) {
        window.location.assign(response.url);
        return;
      }
      setCheckoutError('Unable to start checkout. Please try again.');
    } catch (err) {
      setCheckoutError(getFunctionErrorMessage(err, 'Unable to start checkout. Please try again.'));
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 rounded-3xl bg-secondary/30 border border-secondary"
        >
          <div className="bg-white p-4 rounded-full inline-block mb-6 shadow-sm">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-serif text-foreground mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Looks like you haven't added any handmade treasures yet.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setCurrentPage('shop')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </button>

        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item, index) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <motion.div
                  key={`${item.productId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-secondary hover:shadow-md transition-shadow flex gap-6 items-start"
                >
                  <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif font-bold truncate pr-4">{product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantOptions)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-1 mb-4">
                      {Object.keys(item.variantOptions).length > 0 && (
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          {Object.entries(item.variantOptions).map(([key, value]) => (
                            <span key={key} className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.personalization && (
                        <div className="text-sm text-primary italic">
                          "{item.personalization}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variantOptions, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors shadow-sm disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variantOptions, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xl font-bold text-foreground">${(product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl border border-secondary p-8 shadow-lg sticky top-24">
              <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Shipping Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input value={shippingAddress.name} onChange={handleShippingChange('name')} placeholder="Full name" />
                    <Input value={shippingAddress.company ?? ''} onChange={handleShippingChange('company')} placeholder="Company (optional)" />
                    <Input value={shippingAddress.email} onChange={handleShippingChange('email')} placeholder="Email" />
                    <Input value={shippingAddress.phone} onChange={handleShippingChange('phone')} placeholder="Phone" />
                    <Input value={shippingAddress.street1} onChange={handleShippingChange('street1')} placeholder="Address line 1" />
                    <Input value={shippingAddress.street2 ?? ''} onChange={handleShippingChange('street2')} placeholder="Address line 2 (optional)" />
                    <Input value={shippingAddress.city} onChange={handleShippingChange('city')} placeholder="City" />
                    <Input value={shippingAddress.state} onChange={handleShippingChange('state')} placeholder="State" />
                    <Input value={shippingAddress.zip} onChange={handleShippingChange('zip')} placeholder="ZIP" />
                    <select
                      value={shippingAddress.country}
                      onChange={handleShippingChange('country')}
                      className="h-9 rounded-md border border-input bg-input-background px-3 text-sm"
                    >
                      <option value="US">United States</option>
                    </select>
                  </div>
                  <button
                    onClick={handleFetchRates}
                    className="mt-4 w-full rounded-full bg-secondary py-2 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-60"
                    disabled={isFetchingRates}
                  >
                    {isFetchingRates ? 'Fetching Rates…' : 'Get Shipping Rates'}
                  </button>
                  {shippingError && <div className="mt-3 text-sm text-destructive">{shippingError}</div>}
                </div>

                {shippingRates.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Shipping Options</h3>
                    {shippingRates.map((rate) => (
                      <label
                        key={rate.rateId}
                        className="flex items-start gap-3 rounded-xl border border-secondary px-3 py-2 text-sm cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="shippingRate"
                          value={rate.rateId}
                          checked={selectedRateId === rate.rateId}
                          onChange={() => setSelectedRateId(rate.rateId)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between gap-2">
                            <span className="font-medium text-foreground">
                              {rate.provider} {rate.serviceName}
                            </span>
                            <span className="font-semibold text-foreground">${getDisplayAmount(rate).toFixed(2)}</span>
                          </div>
                          {rate.estimatedDays !== null && (
                            <div className="text-xs text-muted-foreground">
                              Estimated {rate.estimatedDays} days {rate.durationTerms ? `• ${rate.durationTerms}` : ''}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-sm italic">
                      {selectedRate ? `$${getDisplayAmount(selectedRate).toFixed(2)}` : 'Select a rate'}
                    </span>
                  </div>
                  <div className="border-t border-secondary pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {checkoutError && (
                <div className="mb-4 text-sm text-destructive">{checkoutError}</div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 mb-4 disabled:opacity-60"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Starting Checkout…' : 'Proceed to Checkout'}
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-muted-foreground text-sm hover:text-destructive transition-colors"
              >
                Clear Shopping Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
