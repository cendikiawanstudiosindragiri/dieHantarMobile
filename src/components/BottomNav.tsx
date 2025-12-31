'use client';

import { Home, Compass, Receipt, User, QrCode } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const NavButton = ({ icon: Icon, label, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-14 transition-colors ${isActive ? 'text-orange-600' : 'text-gray-400 hover:text-orange-500'}`}>
    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[9px] font-bold">{label}</span>
  </button>
);

const BottomNav = ({ activePage, setActivePage }: BottomNavProps) => {
  return (
    <nav className="glass-nav px-6 py-3 flex justify-between items-end z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative">
      <NavButton icon={Home} label="Home" isActive={activePage === 'home'} onClick={() => setActivePage('home')} />
      <NavButton icon={Compass} label="Explore" isActive={activePage === 'promo'} onClick={() => setActivePage('promo')} />

      <button className="fab-scan -mt-8 w-14 h-14 bg-gradient-to-br from-zinc-800 to-black rounded-full text-white flex items-center justify-center border-4 border-gray-50 relative z-10 group">
          <QrCode size={24} className="text-xl relative z-10" />
          <div className="scan-line"></div>
      </button>

      <NavButton icon={Receipt} label="Order" isActive={activePage === 'history'} onClick={() => setActivePage('history')} />
      <NavButton icon={User} label="Akun" isActive={activePage === 'profile'} onClick={() => setActivePage('profile')} />
    </nav>
  );
};

export default BottomNav;
