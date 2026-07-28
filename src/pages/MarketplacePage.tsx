/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, BookOpen, Cpu, Plus, Minus, Trash, Tag, ShieldCheck, Sparkles, CheckCircle, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface MarketplacePageProps {
  onCheckout: (amount: number, planName: string) => void;
  onTriggerNotification: (text: string) => void;
  onOpenApptModal?: () => void;
}

export default function MarketplacePage({ onCheckout, onTriggerNotification, onOpenApptModal }: MarketplacePageProps) {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activePricingIndex, setActivePricingIndex] = useState(1);

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
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Resource Vault & Careers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Acquire premium templates, teacher-authorized e-books, IoT developer gadgets, or search tech contracts.
          </p>
        </div>
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl cursor-pointer relative flex items-center gap-2 shadow-md transition-all"
        >
          <ShoppingCart className="w-5 h-5 text-emerald-400" />
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-[10px] text-white font-mono px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
          <span className="text-xs font-semibold hidden sm:inline">Cart Total: ₦{(cartTotal || 0).toLocaleString()}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Products Section (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(prod => (
              <div 
                key={prod.id} 
                className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-wider bg-slate-950 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded uppercase">
                      {prod.category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">⭐ {prod.rating} Rating</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{prod.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">{prod.description}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] font-mono uppercase text-slate-500">Resource Price</span>
                    <span className="text-xs font-black text-white">₦{(prod.price || 0).toLocaleString()} <span className="text-[10px] text-emerald-400 font-semibold font-mono">(~${Math.round((prod.price || 0) / 600)} USD)</span></span>
                  </div>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pulzitive Agency Pricing */}
          <div className="border-t border-slate-900 pt-10 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Pulzitive Agency Pricing</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Growth-Engineered Marketing Tiers
              </h2>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                Consistently acquire customers and scale organic authority. Select a tier optimized for your budget, or book a strategy session to outline custom deliverables.
              </p>
            </div>

            {/* Slider/Carousel inside dark mode */}
            <div className="relative">
              {/* Carousel Viewport */}
              <div className="overflow-hidden py-4">
                <div 
                  className="flex transition-transform duration-500 ease-out gap-6 md:grid md:grid-cols-3 md:transform-none"
                  style={{
                    transform: `translateX(calc(-${activePricingIndex * 100}% - ${activePricingIndex * 24}px))`
                  }}
                >
                  {[
                    {
                      id: "starter",
                      name: "Starter Growth Suite",
                      badge: "Starter Launch",
                      price: "₦150,000",
                      desc: "Essential digital marketing setup to establish visibility and local presence.",
                      popular: false,
                      features: [
                        "Content Creation: 2 SEO blog articles & 5 professional graphic designs per month",
                        "Social Media: Complete setup and daily scheduling across 1 primary platform",
                        "Local SEO: Google Business listing and essential citation syndication",
                        "Monthly performance KPI dashboard report"
                      ],
                      btnLabel: "Subscribe Starter",
                      secondaryBtnLabel: "Discuss Starter Pack"
                    },
                    {
                      id: "growth",
                      name: "Search & Social Dominance",
                      badge: "Growth Campaigns",
                      price: "₦350,000",
                      desc: "Aggressive search marketing and deep multi-platform engagement to accelerate customer inflow.",
                      popular: true,
                      features: [
                        "Search Engine Marketing (SEM): Full Google Ads / Pay-Per-Click setup & daily bid optimization",
                        "Technical SEO: Advanced keyword audits, schema setup & page speed tuning",
                        "Content Creation: 4 high-value blog articles, 12 graphics & 2 high-impact edited videos",
                        "Social Media: Daily campaign oversight and comment management across 2 platforms"
                      ],
                      btnLabel: "Subscribe Growth",
                      secondaryBtnLabel: "Schedule Consult"
                    },
                    {
                      id: "enterprise",
                      name: "Enterprise Web & Omnichannel",
                      badge: "Enterprise scale",
                      price: "₦750,000",
                      desc: "Full-stack software engineering integrated with custom digital campaign architecture.",
                      popular: false,
                      features: [
                        "Web Development: Custom React / Next.js high-converting landing portal, fully-coded & updated",
                        "Content Creation: Weekly long-form articles, unlimited custom ad banners & 5 edited reels/shorts",
                        "Omnichannel Ads: Continuous bid optimization across Google, LinkedIn, Meta, and Bing search",
                        "Weekly 1-on-1 strategy briefing with assigned Director of Acquisition"
                      ],
                      btnLabel: "Subscribe Enterprise",
                      secondaryBtnLabel: "Discuss Enterprise Custom"
                    }
                  ].map((plan, idx) => {
                    const isActive = idx === activePricingIndex;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setActivePricingIndex(idx)}
                        className={`w-full shrink-0 md:shrink md:w-auto bg-slate-900/40 border rounded-3xl p-5 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-300 text-left relative ${
                          isActive 
                            ? 'border-emerald-500 ring-4 ring-emerald-500/10 scale-[1.02] shadow-md z-10' 
                            : 'border-slate-800 md:opacity-75 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm z-20">
                            Recommended Choice
                          </span>
                        )}

                        <div className="space-y-4">
                          <div>
                            <span className={`text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase ${
                              isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'
                            }`}>
                              {plan.badge}
                            </span>
                            <h3 className="text-sm font-black text-white mt-2.5 tracking-tight">{plan.name}</h3>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed min-h-[32px]">{plan.desc}</p>
                          </div>

                          <div className="py-2.5 border-y border-slate-800">
                            <p className="text-xl font-black text-white flex items-baseline gap-2">
                              <span>{plan.price}</span>
                              <span className="text-xs font-bold text-emerald-400">
                                (~${Math.round(parseInt(plan.price.replace(/\D/g, '')) / 600)} USD)
                              </span>
                              <span className="text-[10px] font-normal text-slate-400">/month</span>
                            </p>
                          </div>

                          <ul className="space-y-2 text-[10px] text-slate-300">
                            {plan.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-normal">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const numericPrice = parseInt(plan.price.replace(/[^\d]/g, ''));
                              onCheckout(numericPrice, plan.name);
                            }}
                            className={`w-full font-bold py-2 rounded-xl cursor-pointer text-xs transition-all ${
                              isActive
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            {plan.btnLabel}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenApptModal?.();
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 rounded-xl cursor-pointer text-xs transition-colors shadow-sm"
                          >
                            {plan.secondaryBtnLabel}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-2 mt-2 md:hidden">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePricingIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activePricingIndex 
                        ? 'bg-emerald-500 w-4' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Cart Panel / Checkout Sidebar */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 h-fit space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              Your Vault Cart
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Items: {cart.length}</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-[11px] text-slate-500 text-center py-6">Your shopping cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center justify-between gap-2.5 p-2 bg-slate-950/40 rounded-xl border border-slate-850/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold truncate text-white">{item.product.title}</p>
                    <p className="text-[9px] font-mono text-emerald-400">₦{(item.product.price || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] font-mono font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-950/20 rounded cursor-pointer ml-1"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Price:</span>
                <span className="font-bold text-white font-mono">₦{(cartTotal || 0).toLocaleString()} NGN</span>
              </div>
              <button
                onClick={() => onCheckout(cartTotal, 'Vault Products Cart Bundle')}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Secure checkout with PayPal (pulzitive@gmail.com)
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
