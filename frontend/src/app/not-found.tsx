import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 flex flex-col items-center max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="text-red-500" size={40} />
                </div>

                <h2 className="text-3xl font-black mb-2">Page Introuvable</h2>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                    Désolé, la page que vous recherchez semble avoir disparu dans le néant ou n'a jamais existé.
                </p>

                <Link
                    href="/"
                    className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors w-full justify-center"
                >
                    <Home size={20} />
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
