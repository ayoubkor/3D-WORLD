"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Package, ArrowLeft } from 'lucide-react';

interface Product {
    id: number;
    name_fr: string;
    price: string;
    category: string;
    subcategory?: string; // Optional because legacy products might not have it
    stock: number;
    image_url: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

        try {
            await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
            });
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la suppression');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link href="/admin/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
                <ArrowLeft size={20} className="mr-2" />
                Retour au Tableau de Bord
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-2">Gestion des Produits</h1>
                    <p className="text-zinc-400">Gérez votre catalogue et vos stocks</p>
                </div>
                <Link href="/admin/dashboard/products/new" className="btn-primary flex items-center gap-2 px-6 py-3">
                    <Plus size={20} />
                    Nouveau Produit
                </Link>
            </div>

            <div className="anime-card overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-zinc-800 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:border-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900/50 text-zinc-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4">Sous-catégorie</th>
                                <th className="px-6 py-4">Prix</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-zinc-500 flex flex-col items-center">
                                        <Package size={48} className="mb-4 opacity-20" />
                                        Aucun produit trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden">
                                                {product.image_url ? (
                                                    <img src={`http://localhost:5000${product.image_url}`} alt={product.name_fr} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{product.name_fr}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                                                {product.category || 'Non classé'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-sm">
                                            {product.subcategory || '-'}
                                        </td>
                                        <td className="px-6 py-4 font-bold">{product.price} €</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-500/10 text-green-500' :
                                                product.stock > 0 ? 'bg-orange-500/10 text-orange-500' :
                                                    'bg-red-500/10 text-red-500'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/dashboard/products/${product.id}`} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
