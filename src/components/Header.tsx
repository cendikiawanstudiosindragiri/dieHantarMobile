'use client';

import { Bell, Wallet, RefreshCw } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 pb-8 rounded-b-[2.5rem] shadow-orange-900/20 shadow-xl flex-shrink-0 z-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      <div className="relative flex justify-between items-center text-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/20 p-0.5 border border-white/30 backdrop-blur-md overflow-hidden shadow-inner">
            <Image src="https://ui-avatars.com/api/?name=Sultan&background=random" alt="User Avatar" width={44} height={44} className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <p className="text-orange-100 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Halo Sultan,</p>
            <h1 className="text-sm font-black italic uppercase leading-none drop-shadow-md">Diecast</h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center relative active:bg-white/20 transition">
            <Bell size={16} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
          </button>
          <button onClick={() => window.location.reload()} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center active:rotate-180 transition-transform duration-500">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="relative mt-6 bg-zinc-900/90 backdrop-blur-md p-4 rounded-[1.5rem] flex justify-between items-center border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Wallet size={16} />
           </div>
           <div>
              <p className="text-zinc-500 text-[8px] uppercase font-black tracking-widest mb-0.5">Saldo Aktif</p>
              <h2 className="text-white text-lg font-black tracking-tight">Rp 1.234.567</h2>
           </div>
        </div>
        <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-orange-600/30 transition-all active:scale-95">
          Top Up
        </button>
      </div>
    </header>
  );
};

export default Header;
