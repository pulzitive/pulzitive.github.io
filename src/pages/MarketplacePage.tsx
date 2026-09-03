/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, BookOpen, Cpu, Plus, Minus, Trash, Tag, ShieldCheck, Sparkles, CheckCircle, Check, ChevronLeft, ChevronRight, Download, Box } from 'lucide-react';
import { Product } from '../types';
import { AnimatedHeroTitle } from '../components/AnimatedHeroTitle';

interface MarketplacePageProps {
  onCheckout: (amount: number, planName: string) => void;
  onTriggerNotification: (text: string) => void;
  onOpenApptModal?: () => void;
}

export default function MarketplacePage({ onCheckout, onTriggerNotification, onOpenApptModal }: MarketplacePageProps) {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const products: Product[] = [
    {
      id: 'prod-brand-kit',
      title: 'Brand Identity & Positioning Playbook',
      description: 'The executive blueprint for crafting brand equity, logo usage guidelines, visual identity, and brand voice frameworks.',
      price: 9500,
      category: 'E-Books',
      rating: 5.0,
      downloads: 1850
    },
    {
      id: 'prod-corp-comm',
      title: 'Corporate Communications & Crisis PR Blueprint',
      description: 'Executive handbook containing crisis management protocols, media response templates, internal comms, and stakeholder alignment checklists.',
      price: 12500,
      category: 'E-Books',
      rating: 4.9,
      downloads: 1410
    },
    {
      id: 'prod-pr-kit',
      title: 'Executive PR & Media Syndication Kit',
      description: 'Press release distribution templates, media relations pitch guides, executive bio formats, and reporter outreach databases.',
      price: 11000,
      category: 'E-Books',
      rating: 4.9,
      downloads: 980
    },
    {
      id: 'prod-1',
      title: 'Full-Stack Developer Starter Kit',
      description: 'The definitive guidelines & boilerplate configurations for structuring Vite, React, and Node servers.',
      price: 3500,
      category: 'E-Books',
      rating: 4.8,
      downloads: 1420
    },
    {
      id: 'prod-2',
      title: 'SEO Secrets & Ad Conversion Funnels',
      description: 'Exclusive templates for tracking keywords, computing meta CTRs, and optimizing landing page margins.',
      price: 2500,
      category: 'E-Books',
      rating: 4.9,
      downloads: 890
    },
    {
      id: 'prod-3',
      title: 'Pulzitive Campaign Smart Analytics Dial',
      description: 'Physical tactical hardware dial for tracking live PPC budget performance and real-time ad ROAS fluctuations.',
      price: 18000,
      category: 'Gadgets',
      rating: 4.6,
      downloads: 230
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
    onTriggerNotification(`Added "${product.title}" to your Resource Vault cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="bg-white text-slate-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 relative z-10">
        <div>
          <AnimatedHeroTitle 
            primaryText="Resource Vault &"
            highlightText="Digital Toolkits."
            dark={false}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          />
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Acquire premium templates, teacher-authorized e-books, IoT developer gadgets, or search tech contracts.
          </p>
        </div>
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl cursor-pointer relative flex items-center gap-2 shadow-sm transition-all self-start md:self-auto"
        >
          <ShoppingCart className="w-5 h-5 text-white" />
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-[10px] text-white font-mono px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
          <span className="text-xs font-semibold hidden sm:inline">Cart Total: ₦{(cartTotal || 0).toLocaleString()}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Products Section (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(prod => (
              <div 
                key={prod.id} 
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-wider bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded font-bold shadow-xs uppercase">
                      {prod.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">⭐ {prod.rating} Rating</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{prod.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">{prod.description}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-slate-400">Resource Price</span>
                    <span className="text-xs font-black text-slate-900">₦{(prod.price || 0).toLocaleString()} <span className="text-[10px] text-emerald-600 font-semibold font-mono">(~${Math.round((prod.price || 0) / 600)} USD)</span></span>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Cart Panel / Checkout Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              Your Vault Cart
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Items: {cart.length}</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-6">Your shopping cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold truncate text-slate-900">{item.product.title}</p>
                    <p className="text-[9px] font-mono text-emerald-600">₦{(item.product.price || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] font-mono font-bold w-4 text-center text-slate-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded cursor-pointer ml-1"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Total Price:</span>
                <span className="font-bold text-slate-900 font-mono">₦{(cartTotal || 0).toLocaleString()} NGN</span>
              </div>
              <button
                onClick={() => onCheckout(cartTotal, 'Vault Products Cart Bundle')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl cursor-pointer text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-white font-extrabold">Secure checkout with PayPal</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
