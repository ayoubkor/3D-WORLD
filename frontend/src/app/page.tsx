"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Zap, Star, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} />
            <span>New Collection 2026</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
          >
            {t.hero.title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-primary neon-text" : ""}>{word} </span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/products" className="btn-primary text-lg group">
              {t.hero.cta}
              <ArrowRight size={22} className={`transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"}`} />
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements Decor */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Zap size={32} />, title: "Qualité Premium", desc: "Impression haute résolution avec des matériaux durables et finitions soignées.", color: "text-primary" },
            { icon: <Star size={32} />, title: "Design Unique", desc: "Des modèles exclusifs inspirés de la culture pop et anime, introuvables ailleurs.", color: "text-secondary" },
            { icon: <ShieldCheck size={32} />, title: "Livraison Sécurisée", desc: "Emballage blindé pour garantir l'arrivée intacte de vos objets de collection.", color: "text-accent" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="anime-card p-10 flex flex-col gap-6"
            >
              <div className={`${feature.color} bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black tracking-tight">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Products Preview */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl font-black mb-4 tracking-tighter">{t.products.popular}</h2>
            <div className="h-2 w-24 bg-primary rounded-full"></div>
          </div>
          <Link href="/products" className="group flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm">
            {t.nav.products} 
            <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowRight size={18} className={isRTL ? "rotate-180" : ""} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="anime-card group">
              <div className="aspect-square bg-zinc-900/50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black text-2xl italic opacity-20">
                  ITEM #{id}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                   <button className="w-full py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                     Quick View
                   </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Produit Anime #{id}</h3>
                <p className="text-2xl font-black text-white">25.00 €</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
