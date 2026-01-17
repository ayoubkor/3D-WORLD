"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = {
    "Deco": ["vase", "luminaire", "sculpture"],
    "Accessoires": ["port cles", "support telephone"],
    "Etui": ["etui telephone", "etui cigarete"],
    "Gaming support": ["casques", "manette", "pc", "port cles", "led signs"]
};

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name_fr: '',
        name_ar: '',
        description_fr: '',
        description_ar: '',
        price: '',
        original_price: '',
        is_promo: false,
        category: '',
        subcategory: '',
        stock: '',
        image: null as File | null
    });
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name_fr: data.name_fr || '',
                        name_ar: data.name_ar || '',
                        description_fr: data.description_fr || '',
                        description_ar: data.description_ar || '',
                        price: data.price || '',
                        original_price: data.original_price || '',
                        is_promo: Boolean(data.is_promo), // Ensure boolean
                        category: data.category || '',
                        subcategory: data.subcategory || '',
                        stock: data.stock || '',
                        image: null
                    });
                    if (data.image_url) {
                        setCurrentImageUrl(`http://localhost:5000${data.image_url}`);
                    }
                } else if (res.status === 404) {
                    // Product not found - trigger Next.js 404 page
                    notFound();
                } else {
                    alert("Erreur lors du chargement du produit");
                    router.push('/admin/dashboard/products');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchProduct();
    }, [params.id, router]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            category: e.target.value,
            subcategory: ''
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                is_promo: checked,
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const data = new FormData();
            data.append('name_fr', formData.name_fr);
            data.append('name_ar', formData.name_ar);
            data.append('description_fr', formData.description_fr);
            data.append('description_ar', formData.description_ar);
            data.append('stock', String(formData.stock));
            data.append('category', formData.category);
            data.append('subcategory', formData.subcategory);
            data.append('is_promo', formData.is_promo ? 'true' : 'false');
            data.append('price', String(formData.price));

            if (formData.is_promo) {
                data.append('original_price', String(formData.original_price));
            } else {
                // If not promo, we might want to clear original price or send null
                // But FormData sends strings. Logic in backend might need update if strict.
                // For now, let's just not append it, or send empty.
                data.append('original_price', '');
            }

            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await fetch(`http://localhost:5000/api/products/${params.id}`, {
                method: 'PUT',
                body: data,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la modification');
            }

            router.push('/admin/dashboard/products');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Une erreur est survenue');
        } finally {
            setIsSaving(false);
        }
    };

    const availableSubcategories = formData.category ? (CATEGORIES as any)[formData.category] || [] : [];

    if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/admin/dashboard/products" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Retour aux produits
            </Link>

            <div className="anime-card p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Modifier Produit</h1>
                    <span className="text-xs font-mono text-zinc-500">ID: {params.id}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-40 h-40 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : currentImageUrl ? (
                                <img src={currentImageUrl} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload className="text-zinc-500 group-hover:text-primary mb-2 transition-colors" />
                                    <span className="text-xs text-zinc-500">Modifier l'image</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* FR */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Nom (FR)</label>
                                <input
                                    type="text"
                                    name="name_fr"
                                    required
                                    value={formData.name_fr}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Description (FR)</label>
                                <textarea
                                    name="description_fr"
                                    rows={4}
                                    value={formData.description_fr}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* AR */}
                        <div className="space-y-4" dir="rtl">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">الاسم (AR)</label>
                                <input
                                    type="text"
                                    name="name_ar"
                                    required
                                    value={formData.name_ar}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors text-right"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">الوصف (AR)</label>
                                <textarea
                                    name="description_ar"
                                    rows={4}
                                    value={formData.description_ar}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors text-right"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price and Promo Logic */}
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-3 mb-6">
                            <input
                                type="checkbox"
                                id="edit_is_promo"
                                name="is_promo"
                                checked={formData.is_promo}
                                onChange={handleInputChange}
                                className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-primary focus:ring-primary/50"
                            />
                            <label htmlFor="edit_is_promo" className="font-bold text-white select-none cursor-pointer">
                                Activer la remise spéciale ?
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Standard/Original Price Field */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${formData.is_promo ? 'text-zinc-500 line-through' : 'text-zinc-400'}`}>
                                    {formData.is_promo ? 'Ancien Prix (€)' : 'Prix (€)'}
                                </label>
                                <input
                                    type="number"
                                    name={formData.is_promo ? "original_price" : "price"}
                                    step="0.01"
                                    required
                                    value={formData.is_promo ? formData.original_price : formData.price}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            [formData.is_promo ? 'original_price' : 'price']: val
                                        }));
                                    }}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                                />
                            </div>

                            {/* Promo Price Field (Only if Promo) */}
                            {formData.is_promo && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-bold text-primary mb-2">Nouveau Prix (€)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-800 border-2 border-primary rounded-lg px-4 py-3 focus:outline-none transition-colors"
                                        placeholder="Prix en solde"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    required
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Catégorie</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleCategoryChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors appearance-none"
                            >
                                <option value="">Sélectionner une catégorie</option>
                                <option value="Deco">Deco</option>
                                <option value="Accessoires">Accessoires</option>
                                <option value="Etui">Etui</option>
                                <option value="Gaming support">Gaming support</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Sous-catégorie</label>
                            <select
                                name="subcategory"
                                required
                                value={formData.subcategory}
                                onChange={handleInputChange}
                                disabled={!formData.category}
                                className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors appearance-none ${!formData.category ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Sélectionner une sous-catégorie</option>
                                {availableSubcategories.map((sub: string) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full btn-primary py-3 flex items-center justify-center font-bold mt-8"
                    >
                        {isSaving ? <Loader2 className="animate-spin mr-2" /> : null}
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}
