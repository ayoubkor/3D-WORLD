"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Loader2, Package, CheckCircle2,
    Inbox, Settings, Truck, Archive, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const PHASES = [
    {
        id: 'reception',
        label: 'Réception & Triage',
        icon: <Inbox size={18} />,
        color: 'from-blue-600 to-indigo-600',
        statuses: ['nouvelle', 'confirmee']
    },
    {
        id: 'production',
        label: 'Atelier Production',
        icon: <Settings size={18} />,
        color: 'from-orange-500 to-purple-600',
        statuses: ['conception', 'en machine', 'assamblage', 'ambalage']
    },
    {
        id: 'logistics',
        label: 'Logistique',
        icon: <Truck size={18} />,
        color: 'from-teal-500 to-green-600',
        statuses: ['societe de livraison', 'livree']
    },
    {
        id: 'archives',
        label: 'Archives & Retours',
        icon: <Archive size={18} />,
        color: 'from-red-500 to-zinc-600',
        statuses: ['retour', 'annulee']
    }
];

const STATUS_CONFIG: any = {
    'nouvelle': { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5' },
    'confirmee': { color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/5' },
    'conception': { color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/5' },
    'en machine': { color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/5' },
    'assamblage': { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5' },
    'ambalage': { color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/5' },
    'societe de livraison': { color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-500/5' },
    'livree': { color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/5' },
    'retour': { color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5' },
    'annulee': { color: 'text-zinc-400', border: 'border-zinc-500/30', bg: 'bg-zinc-500/5' }
};

export default function FullDashboardPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePhase, setActivePhase] = useState(PHASES[0]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getOrdersByStatus = (status: string) => orders.filter(o => o.status === status);

    const getPhaseCount = (phase: any) => {
        return orders.filter(o => phase.statuses.includes(o.status)).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono">
                <Loader2 className="animate-spin mr-3" /> INITIALISATION DU SYSTÈME...
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-zinc-300 overflow-hidden font-sans selection:bg-white/20">

            {/* --- HEADER --- */}
            <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-6">
                    <Link href="/admin/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">Centre de Contrôle de Production</h1>
                        <p className="text-[10px] text-zinc-600 font-mono mt-0.5">VUE SYNOPTIQUE GLOBALE // {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="flex gap-8">
                    <div className="text-right">
                        <span className="block text-[10px] text-zinc-600 uppercase tracking-wider">Total Commandes</span>
                        <span className="text-xl font-bold font-mono text-white leading-none">{orders.length}</span>
                    </div>
                </div>
            </header>

            {/* --- TABS NAVIGATION --- */}
            <nav className="flex border-b border-white/5 bg-black/20">
                {PHASES.map((phase) => {
                    const isActive = activePhase.id === phase.id;
                    const count = getPhaseCount(phase);

                    return (
                        <button
                            key={phase.id}
                            onClick={() => setActivePhase(phase)}
                            className={`flex-1 h-14 flex items-center justify-center gap-3 relative transition-all duration-300 group
                                ${isActive ? 'text-white bg-white/[0.03]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]'}`}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabLine"
                                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${phase.color}`}
                                />
                            )}

                            <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                {phase.icon}
                            </span>
                            <span className="font-bold text-sm tracking-wide">{phase.label}</span>

                            {count > 0 && (
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${isActive ? 'border-white/20 bg-white/10 text-white' : 'border-zinc-800 bg-zinc-900 text-zinc-600'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePhase.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-6 h-full min-w-max"
                    >
                        {activePhase.statuses.map((status) => {
                            const columnOrders = getOrdersByStatus(status);
                            const config = STATUS_CONFIG[status] || STATUS_CONFIG['nouvelle'];

                            return (
                                <div key={status} className="w-[340px] flex flex-col h-full bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                                    {/* Column Header */}
                                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${config.bg.replace('/5', '')} shadow-[0_0_10px_currentColor] ${config.color.replace('text-', 'text-')}`}></div>
                                            <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-300">{status}</h3>
                                        </div>
                                        <span className="text-zinc-600 font-mono text-xs">
                                            {columnOrders.length}
                                        </span>
                                    </div>

                                    {/* Cards Scroll Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                        {columnOrders.map((order) => (
                                            <div
                                                key={order.id}
                                                className={`p-4 rounded-lg bg-[#111] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden`}
                                            >
                                                {/* Left Accent Border */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${config.bg.replace('/5', '')}`}></div>

                                                <div className="flex justify-between items-start mb-3 pl-2">
                                                    <span className="font-mono text-[10px] text-zinc-600">CMD-{order.id.toString().padStart(4, '0')}</span>
                                                    <span className="text-[10px] text-zinc-500 font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                                                </div>

                                                <div className="pl-2 relative z-10">
                                                    <h4 className="text-zinc-200 font-bold leading-tight mb-1">{order.customer_name}</h4>
                                                    {order.customer_phone && <p className="text-xs text-zinc-600 font-mono mb-3">{order.customer_phone}</p>}

                                                    {/* Quick Items Preview */}
                                                    {order.items && order.items.length > 0 && (
                                                        <div className="space-y-1 mb-3">
                                                            {order.items.slice(0, 3).map((item: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-2 text-[11px] text-zinc-400">
                                                                    <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                                                                    <span className="truncate flex-1">{item.name_fr}</span>
                                                                    <span className="text-zinc-600 font-mono">x{item.quantity}</span>
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <p className="text-[10px] text-zinc-600 pl-3">+ {order.items.length - 3} article(s)</p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                            <Package size={12} />
                                                            <span>{order.items ? order.items.length : 0} Élém.</span>
                                                        </div>
                                                        <span className={`font-mono font-bold text-sm ${status === 'livree' ? 'text-green-500' : 'text-zinc-300'}`}>
                                                            {order.total_price} €
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {columnOrders.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center opacity-20">
                                                <Inbox size={32} className="mb-2" />
                                                <p className="text-xs font-mono uppercase">Aucune commande</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
