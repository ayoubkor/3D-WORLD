"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { ShoppingCart, Search, Filter, ArrowRight, Loader2, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = {
  "All": [],
  "Deco": ["vase", "luminaire", "sculpture"],
  "Accessoires": ["port cles", "support telephone"],
  "Etui": ["etui telephone", "etui cigarete"],
  "Gaming support": ["casques", "manette", "pc", "port cles", "led signs"]
};

// Flatten variants logic if needed or keep simple string matching
// "port cles (simple-gaming)" -> In the admin we treated them as just "port cles"
// Ideally backend returns "port cles" so it matches here.

const ProductsPage = () => {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory(null);
  };

  const filteredProducts = products.filter(p => {
    if (activeCategory !== 'All' && p.category !== activeCategory) {
      return false;
    }
    if (activeSubcategory && p.subcategory !== activeSubcategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.products.title}
          </h1>
          <p className="text-zinc-500 max-w-md">Découvrez nos créations 3D uniques.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 no-scrollbar">
            {Object.keys(CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-zinc-900 text-zinc-400'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden lg:block anime-card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Filter size={20} className="text-primary" />
              Filtres
            </h3>

            <div className="space-y-2">
              {Object.keys(CATEGORIES).map((cat) => (
                <div key={cat}>
                  <button
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>

                  {activeCategory === cat && (CATEGORIES as any)[cat].length > 0 && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-zinc-800 pl-2">
                      {(CATEGORIES as any)[cat].map((sub: string) => (
                        <button
                          key={sub}
                          onClick={() => setActiveSubcategory(activeSubcategory === sub ? null : sub)}
                          className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${activeSubcategory === sub
                            ? 'text-white font-bold bg-zinc-800'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="text-zinc-500">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 anime-card">
              <Package size={48} className="mb-4 opacity-20" />
              <p>Aucun produit trouvé dans cette catégorie.</p>
              <button
                onClick={() => { setActiveCategory('All'); setActiveSubcategory(null); }}
                className="mt-4 text-primary hover:underline"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={product.id}
                  className="anime-card group flex flex-col h-full bg-zinc-900 border border-zinc-800/50 hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-square bg-zinc-950 relative overflow-hidden rounded-t-xl">
                    {product.image_url ? (
                      <img
                        src={`http://localhost:5000${product.image_url}`}
                        alt={product.name_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black text-4xl italic opacity-20 group-hover:scale-110 transition-transform duration-500">
                        3D PRINT
                      </div>
                    )}

                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 shadow-lg">
                      {product.category}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                        {product.subcategory || '\u00A0'}
                      </div>
                      {product.is_promo && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          PROMO
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {lang === 'fr' ? product.name_fr : product.name_ar}
                    </h3>

                    <div className="mt-auto flex items-end justify-between gap-4">
                      <div className="flex flex-col">
                        {product.is_promo && Number(product.original_price) > 0 && (
                          <span className="text-sm text-zinc-500 line-through font-medium">
                            {product.original_price} €
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-black ${product.is_promo ? 'text-red-500' : 'text-white'}`}>
                            {product.price}
                          </span>
                          <span className={`font-bold text-sm ${product.is_promo ? 'text-red-500/80' : 'text-zinc-400'}`}>€</span>
                        </div>
                      </div>

                      <Link
                        href={`/products/${product.id}`}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg shadow-primary/25"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
