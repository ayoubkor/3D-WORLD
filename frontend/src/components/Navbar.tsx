"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, User, Zap } from 'lucide-react';

const Navbar = () => {
  const { lang, setLang, t, isRTL } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                PRINT<span className="text-primary">3D</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">{t.nav.home}</Link>
              <Link href="/products" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">{t.nav.products}</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-primary transition-all group"
            >
              <Globe size={16} className="group-hover:text-primary transition-colors" />
              <span className="text-xs font-black uppercase tracking-tighter">
                {lang === 'fr' ? 'العربية' : 'Français'}
              </span>
            </button>
            
            <Link href="/admin" className="w-10 h-10 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
