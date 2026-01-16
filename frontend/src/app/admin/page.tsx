"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation login
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      alert('Identifiants incorrects (admin / admin123)');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="anime-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-zinc-500">Accès réservé</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Utilisateur</label>
            <input 
              type="text" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Mot de passe</label>
            <input 
              type="password" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-primary outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
