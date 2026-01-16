"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, Users, Loader2, Edit, X, Check, Eye } from 'lucide-react';

// Status Configuration
const STATUS_FLOW = [
  'nouvelle',
  'confirmee',
  'conception',
  'en machine',
  'assamblage',
  'ambalage',
  'societe de livraison',
  'livree',
  'retour',
  'annulee'
];

const STATUS_COLORS: any = {
  'nouvelle': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'confirmee': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  'conception': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'en machine': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'assamblage': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'ambalage': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'societe de livraison': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  'livree': 'bg-green-500/10 text-green-500 border-green-500/20',
  'retour': 'bg-red-500/10 text-red-500 border-red-500/20',
  'annulee': 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
};

const Dashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    revenue: 0,
    clients: 0
  });

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);

        // Calculate Stats
        // REVENUE: Only calculated for orders with status 'livree'
        const totalRevenue = data
          .filter((o: any) => o.status === 'livree')
          .reduce((acc: number, o: any) => acc + Number(o.total_price), 0);

        const uniqueClients = new Set(data.map((o: any) => o.customer_phone)).size;

        setStats(prev => ({
          ...prev,
          orders: data.length,
          revenue: totalRevenue,
          clients: uniqueClients
        }));
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const initiateStatusUpdate = async () => {
    if (!selectedOrder) return;

    // Security check for 'livree' status
    if (newStatus === 'livree') {
      setPasswordPrompt(true);
    } else {
      confirmUpdateStatus();
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === '3d world') {
      setPasswordPrompt(false);
      setPasswordInput('');
      confirmUpdateStatus();
    } else {
      alert("Mot de passe incorrect !");
    }
  };

  const confirmUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Optimistic Update
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
        setSelectedOrder(null);
        setNewStatus('');
        fetchData(); // Refresh to update revenue potentially
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setPasswordPrompt(false);
    setPasswordInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Tableau de Bord</h1>
        <div className="flex gap-4">
          <Link href="/admin/dashboard/full" className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition-colors font-bold flex items-center shadow-lg shadow-red-900/20">
            DASHBORD
          </Link>
          <Link href="/admin/dashboard/products" className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors font-bold">
            Gérer Produits
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="anime-card p-6">
          <div className="mb-4 text-primary"><ShoppingCart /></div>
          <p className="text-zinc-500 text-sm mb-1">Commandes</p>
          <p className="text-3xl font-black">{stats.orders}</p>
        </div>
        <div className="anime-card p-6">
          <div className="mb-4 text-secondary"><Package /></div>
          <p className="text-zinc-500 text-sm mb-1">Produits</p>
          <p className="text-3xl font-black">20+</p>
        </div>
        <div className="anime-card p-6">
          <div className="mb-4 text-green-500"><TrendingUp /></div>
          <p className="text-zinc-500 text-sm mb-1">Revenus (Livrées)</p>
          <p className="text-3xl font-black">{stats.revenue.toFixed(2)} €</p>
        </div>
        <div className="anime-card p-6">
          <div className="mb-4 text-accent"><Users /></div>
          <p className="text-zinc-500 text-sm mb-1">Clients Uniques</p>
          <p className="text-3xl font-black">{stats.clients}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="anime-card overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="font-bold text-xl">Commandes Récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-zinc-900/20">
            <thead className="bg-zinc-900/50 text-zinc-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Heure</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    <div className="flex justify-center mb-2"><Loader2 className="animate-spin" /></div>
                    Chargement...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Aucune commande pour le moment.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const dateObj = new Date(order.created_at);
                  return (
                    <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {order.customer_name}
                        <div className="text-xs text-zinc-500">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {dateObj.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 font-bold">{order.total_price} €</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${(STATUS_COLORS as any)[order.status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openModal(order)}
                          className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                          title="Voir Détails"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal with Dropdown Status */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Commande #{selectedOrder.id}
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase border ${(STATUS_COLORS as any)[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </h3>
                <p className="text-zinc-500 text-sm">Passée le {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Customer Info */}
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Client</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-zinc-500 text-xs block">Nom Complet</span>
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Téléphone</span>
                    <span className="font-mono">{selectedOrder.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Adresse</span>
                    <span>{selectedOrder.customer_address}</span>
                  </div>
                  {selectedOrder.customer_message && (
                    <div>
                      <span className="text-zinc-500 text-xs block">Message</span>
                      <span className="italic text-zinc-400">{selectedOrder.customer_message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Gestion Statut</h4>

                <div className="mb-4">
                  <label className="block text-sm mb-2 text-zinc-400">Modifier le Statut</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-primary capitalize appearance-none"
                  >
                    {STATUS_FLOW.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {passwordPrompt && (
                  <div className="animate-in slide-in-from-top-2 duration-200 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                    <label className="block text-xs font-bold text-red-500 mb-1">Mot de passe requis (LIVREE)</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Mot de passe..."
                        className="flex-1 bg-zinc-900 border border-red-500/30 rounded px-2 py-1 text-sm outline-none focus:border-red-500"
                      />
                      <button onClick={handlePasswordSubmit} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 rounded font-bold">OK</button>
                    </div>
                  </div>
                )}

                <button
                  onClick={initiateStatusUpdate}
                  disabled={updating || (newStatus === selectedOrder.status)}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition-all ${newStatus === selectedOrder.status
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'btn-primary'
                    }`}
                >
                  {updating ? <Loader2 className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
                  Mettre à jour
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Détails Colis</h4>
              <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900 text-zinc-500">
                    <tr>
                      <th className="px-4 py-2">Produit</th>
                      <th className="px-4 py-2 text-right">Qté</th>
                      <th className="px-4 py-2 text-right">Prix Unit.</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium">{item.name_fr}</td>
                          <td className="px-4 py-3 text-right text-zinc-400">x{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{item.price_at_purchase} €</td>
                          <td className="px-4 py-3 text-right font-bold">{(item.price_at_purchase * item.quantity).toFixed(2)} €</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center text-zinc-500 italic">Détails non disponibles</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-zinc-900/50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-bold text-zinc-400 uppercase">Total Commande</td>
                      <td className="px-4 py-3 text-right font-black text-lg text-primary">{selectedOrder.total_price} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors font-bold text-zinc-400 hover:text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
