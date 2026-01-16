"use client";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';
import { CheckCircle2, Loader2, Minus, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

const ProductDetail = () => {
  const { t, lang } = useLanguage();
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);

    try {
      // Prepare payload matches backend expectation
      const payload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_message: formData.message,
        total_price: product.price * quantity, // Use the real price
        items: [
          {
            product_id: product.id,
            quantity: quantity,
            price: product.price // Logic in model expects item.price
          }
        ]
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert("Erreur lors de l'envoi de la commande. Veuillez réessayer.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary"><Loader2 className="animate-spin" size={40} /></div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-white">Produit non trouvé</div>;
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6 text-green-500 animate-in zoom-in spin-in-90 duration-500">
          <CheckCircle2 size={80} />
        </div>
        <h2 className="text-3xl font-bold mb-4">{t.orderForm.success}</h2>
        <p className="text-zinc-400 mb-8">Nous avons bien reçu votre commande pour : <span className="text-white font-bold">{lang === 'fr' ? product.name_fr : product.name_ar}</span>.</p>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Un membre de notre équipe vous contactera très prochainement au <span className="text-white">{formData.phone}</span> pour confirmer la livraison.</p>
        <button onClick={() => window.location.href = '/products'} className="btn-primary">Retour à la boutique</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image & Info */}
      <div className="space-y-6">
        <div className="aspect-square bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden relative group">
          {product.image_url ? (
            <img
              src={`http://localhost:5000${product.image_url}`}
              alt={product.name_fr}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-zinc-700 italic text-2xl font-black opacity-20">3D PRODUCT</div>
          )}
          {product.is_promo && (
            <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
              PROMO
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-black">{lang === 'fr' ? product.name_fr : product.name_ar}</h1>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            {product.is_promo && Number(product.original_price) > 0 && (
              <span className="text-xl text-zinc-500 line-through font-medium">{product.original_price} €</span>
            )}
            <p className={`text-3xl font-black ${product.is_promo ? 'text-red-500' : 'text-primary'}`}>
              {product.price} €
            </p>
          </div>

          <p className="text-zinc-400 leading-relaxed text-lg">
            {lang === 'fr' ? product.description_fr : product.description_ar}
          </p>
        </div>
      </div>

      {/* Order Form */}
      <div className="anime-card p-8 h-fit sticky top-24">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          {t.orderForm.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quantity */}
          <div className="bg-zinc-900/50 p-4 rounded-lg flex justify-between items-center mb-6">
            <span className="font-bold text-zinc-400">Quantité</span>
            <div className="flex items-center gap-4 bg-zinc-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="font-black w-4 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 rounded transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t.orderForm.name}</label>
            <input
              required
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Votre nom complet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t.orderForm.phone}</label>
            <input
              required
              type="tel"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="06 00 00 00 00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t.orderForm.address}</label>
            <textarea
              required
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Adresse de livraison"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">{t.orderForm.message}</label>
            <textarea
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Instructions spéciales (optionnel)"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-lg font-bold">
            <span>Total à payer</span>
            <span className="text-2xl text-primary">{(product.price * quantity).toFixed(2)} €</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-4 text-lg font-black flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? <Loader2 className="animate-spin" /> : null}
            {t.orderForm.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
