import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Leaf, Sparkles, ChevronRight, Plus, Minus, Trash2, Send, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sommelierMessage, setSommelierMessage] = useState('');
  const [sommelierResponse, setSommelierResponse] = useState('');
  const [isSommelierLoading, setIsSommelierLoading] = useState(false);
  const [isPdfZoomed, setIsPdfZoomed] = useState(false);
  const [currentView, setCurrentView] = useState<'cafe' | 'whiskey'>('cafe');

  const heroImages = [
    "/sawol_soop.jpeg",
    "/sawol_soop1.jpg",
    "/sawol_soop2.jpg",
    "/sawol_soop3.jpg",
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSommelierAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sommelierMessage.trim()) return;

    setIsSommelierLoading(true);
    setSommelierResponse('');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a world-class Tea & Whisky Sommelier at "사월의 숲 [Sawol Soop]". 
        This place is a peaceful Tea House by day and a sophisticated Whisky Bar by night.
        
        A customer asks: "${sommelierMessage}"
        
        Our current offerings: ${PRODUCTS.map(p => `${p.name} (₩${p.price.toLocaleString()}) - ${p.description}`).join(', ')}.
        
        Provide a refined, poetic, and helpful response in Korean. Suggest specific items from our list if relevant. 
        If they ask about the vibe, explain that we are "사월의 숲" (Forest of April) - a place for healing and deep conversation.
        Format your response in Markdown. Keep it concise but atmospheric.`,
      });
      setSommelierResponse(response.text || "죄송합니다. 숲의 정령들이 잠시 자리를 비웠네요. 다시 시도해주세요.");
    } catch (error) {
      console.error("Soopy error:", error);
      setSommelierResponse("수피가 지금 차를 우리거나 위스키를 준비 중입니다. 잠시 후 다시 문의해주세요.");
    } finally {
      setIsSommelierLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-olive/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-bg/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <a href="/" className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Leaf className="w-6 h-6 text-olive" />
              <span>사월의 숲 Sawol Soop</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-12 text-sm uppercase tracking-widest font-sans font-medium">
            <button 
              onClick={() => {
                setCurrentView('cafe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={cn("transition-colors", currentView === 'cafe' ? "text-olive border-b border-olive" : "hover:text-olive")}
            >
              Tea House
            </button>
            <button 
              onClick={() => {
                setCurrentView('whiskey');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={cn("transition-colors", currentView === 'whiskey' ? "text-olive border-b border-olive" : "hover:text-olive")}
            >
              Whiskey Bar
            </button>
            <a href="#soopy" className="hover:text-olive transition-colors">Ask Soopy</a>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-olive text-white text-[10px] flex items-center justify-center rounded-full font-sans">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-8xl font-light leading-[0.9] mb-8">
              {currentView === 'cafe' ? (
                <>
                  사월의 숲 <br />
                  <span className="italic font-serif">Tea House</span>
                </>
              ) : (
                <>
                  사월의 숲 <br />
                  <span className="italic font-serif">Whiskey Bar</span>
                </>
              )}
            </h1>
            <p className="text-xl text-stone-600 max-w-md mb-10 leading-relaxed">
              {currentView === 'cafe' 
                ? "낮에는 따뜻한 차 한 잔의 여유를 전하는 공간입니다." 
                : "밤에는 위스키 한 잔의 위로를 전하는 공간입니다."}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const id = currentView === 'cafe' ? 'tea-menu' : 'whiskey-menu';
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-olive text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-sans font-semibold hover:bg-olive-light transition-all flex items-center gap-2"
              >
                Menu <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl bg-stone-200"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentHeroIndex}
                src={heroImages[currentHeroIndex]} 
                alt={`사월의 숲 - ${currentHeroIndex + 1}`} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Progress Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    idx === currentHeroIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {currentView === 'cafe' ? (
          <motion.div 
            key="cafe-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tea Section */}
            <section id="tea-menu" className="py-24 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-16">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-olive font-sans font-bold mb-4 block">사월의 숲</span>
                    <h2 className="text-5xl font-light">단정한 찻자리</h2>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {PRODUCTS.filter(p => p.category === 'Tea').map((product) => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -10 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-200">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-olive hover:text-white"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold mb-1 block">
                            {product.category}
                          </span>
                          <h3 className="text-xl font-medium mb-1">{product.name}</h3>
                          <p className="text-sm text-stone-500 italic line-clamp-1">{product.description}</p>
                        </div>
                        <span className="text-lg font-sans font-medium">₩{product.price.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dessert Section */}
            <section id="dessert" className="py-24 px-6 bg-stone-50">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-16">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-olive font-sans font-bold mb-4 block">사월의 숲</span>
                    <h2 className="text-5xl font-light">디저트</h2>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {PRODUCTS.filter(p => p.category === 'Dessert').map((product) => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -10 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-200">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-olive hover:text-white"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold mb-1 block">
                            {product.category}
                          </span>
                          <h3 className="text-xl font-medium mb-1">{product.name}</h3>
                          <p className="text-sm text-stone-500 italic line-clamp-1">{product.description}</p>
                        </div>
                        <span className="text-lg font-sans font-medium">₩{product.price.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="whiskey-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Whiskey Section */}
            <section id="whiskey-menu" className="py-24 px-6 bg-stone-900 text-white">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-16">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-olive font-sans font-bold mb-4 block">사월의 숲</span>
                    <h2 className="text-5xl font-light italic">Whiskey Bar</h2>
                  </div>
                </div>

                <div className="space-y-24">
                  {['Tea Cocktail', 'Cocktail', 'Chaskey', 'Blind Course', 'Tasting Course'].map((category) => {
                    const categoryProducts = PRODUCTS.filter(p => p.category === category);
                    if (categoryProducts.length === 0) return null;

                    return (
                      <div key={category}>
                        <h3 className="text-2xl font-light italic mb-10 text-olive border-b border-olive/20 pb-4">
                          {category}
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                          {categoryProducts.map((product) => (
                            <motion.div 
                              key={product.id}
                              whileHover={{ y: -10 }}
                              className="group cursor-pointer"
                            >
                              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 bg-stone-800">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                  referrerPolicy="no-referrer"
                                />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                  }}
                                  className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md p-4 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-olive hover:text-white"
                                >
                                  <Plus className="w-6 h-6" />
                                </button>
                              </div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] uppercase tracking-widest text-olive font-sans font-bold mb-1 block">
                                    {product.category}
                                  </span>
                                  <h3 className="text-xl font-medium mb-1 text-white">{product.name}</h3>
                                  <p className="text-sm text-stone-400 italic line-clamp-1">{product.description}</p>
                                </div>
                                <span className="text-lg font-sans font-medium text-olive">₩{product.price.toLocaleString()}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Sommelier Section */}
      <section id="soopy" className="py-24 bg-olive text-white px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <img 
            src="/soopy.png" 
            alt="수피" 
            className="w-30 h-30 mx-auto mb-8 object-contain"
          />
          <h2 className="text-5xl font-light italic mb-6">Ask Soopy</h2>
          <p className="text-white/70 text-lg mb-12 leading-relaxed">
            나에게 맞는 차, 나에게 맞는 위스키, 어울리는 차와 위스키 조합을 찾아보세요.
          </p>

          <form onSubmit={handleSommelierAsk} className="relative mb-12">
            <input 
              type="text" 
              value={sommelierMessage}
              onChange={(e) => setSommelierMessage(e.target.value)}
              placeholder="e.g., 어떤 느낌의 차를 원하는지, 어떤 느낌의 위스키를 좋아하는지"
              className="w-full bg-white/10 border border-white/20 rounded-full px-8 py-6 pr-16 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-sans"
            />
            <button 
              type="submit"
              disabled={isSommelierLoading}
              className="absolute right-3 top-3 bottom-3 w-12 h-12 bg-white text-olive rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSommelierLoading ? (
                <div className="w-5 h-5 border-2 border-olive/30 border-t-olive rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {sommelierResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-md rounded-[32px] p-10 text-left border border-white/10"
              >
                <div className="markdown-body text-white/90 italic font-serif text-lg leading-relaxed">
                  <Markdown>{sommelierResponse}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-stone-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <a href="/" className="text-2xl font-semibold tracking-tight flex items-center gap-2 mb-6">
              <Leaf className="w-6 h-6 text-olive" />
              <span>사월의 숲 Sawol Soop</span>
            </a>
            <p className="text-stone-500 max-w-sm leading-relaxed">
              낮에는 따뜻한 차 한 잔의 여유를, <br />
              밤에는 깊은 위스키 한 잔의 위로를 전하는 공간입니다.
            </p>
          </div>
          <div>
            <h4 className="font-sans font-bold uppercase text-[10px] tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#menu" className="hover:text-olive transition-colors">Whiskey</a></li>
              <li><a href="#tea-menu" className="hover:text-olive transition-colors">Tea Menu</a></li>
              <li><a href="#dessert" className="hover:text-olive transition-colors">Dessert</a></li>
              <li><a href="#sommelier" className="hover:text-olive transition-colors">Ask to Soopy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-bold uppercase text-[10px] tracking-widest mb-6">Connect</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="https://www.instagram.com/sawol.soop/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-olive transition-colors"
                >
                  Instagram (Tea)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/sawol.soop_bar/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-olive transition-colors"
                >
                  Instagram (Bar)
                </a>
              </li>
              <li>
                <a 
                  href="https://blog.naver.com/sawol_soop" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-olive transition-colors"
                >
                  Blog
                </a>
              </li>
              <li><a href="#" className="hover:text-olive transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-100 flex justify-between items-center text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold">
          <span>© 2024 사월의 숲 [Sawol Soop]</span>
          <span>Sawol Soop — Tea & Whisky</span>
        </div>
      </footer>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-warm-bg z-[70] p-12 flex flex-col"
            >
              <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="mt-20 space-y-8">
                <button 
                  onClick={() => {
                    setCurrentView('cafe');
                    setIsMenuOpen(false);
                  }} 
                  className={cn("block text-4xl font-light italic transition-colors", currentView === 'cafe' ? "text-olive" : "hover:text-olive")}
                >
                  Tea House
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('whiskey');
                    setIsMenuOpen(false);
                  }} 
                  className={cn("block text-4xl font-light italic transition-colors", currentView === 'whiskey' ? "text-olive" : "hover:text-olive")}
                >
                  Whiskey Bar
                </button>
                <a href="#soopy" onClick={() => setIsMenuOpen(false)} className="block text-4xl font-light italic hover:text-olive transition-colors">Ask to Soopy</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-warm-bg z-[70] flex flex-col"
            >
              <div className="p-8 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-2xl font-medium">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 italic">
                    <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                    <p>Your basket is empty</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-stone-500 mb-4">₩{item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-stone-200 rounded-full px-2 py-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-olive transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-sans">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-olive transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-stone-200 bg-stone-50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-stone-500 uppercase tracking-widest text-[10px] font-sans font-bold">Subtotal</span>
                    <span className="text-2xl font-medium">₩{cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-olive text-white py-5 rounded-full text-sm uppercase tracking-widest font-sans font-semibold hover:bg-olive-light transition-all shadow-lg shadow-olive/20">
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
