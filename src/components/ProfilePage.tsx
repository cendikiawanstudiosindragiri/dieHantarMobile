import WalletCard from "./WalletCard";
import { ChevronRight, User, Settings, Shield, HelpCircle, LogOut } from 'lucide-react';

const MenuItem = ({ icon: Icon, label, action }: any) => (
    <button onClick={action} className="flex items-center justify-between w-full p-4 bg-white rounded-lg active:bg-gray-100 transition-all active:scale-[0.98]">
        <div className="flex items-center gap-4">
            <Icon className="text-zinc-500" size={20} />
            <span className="text-sm font-semibold text-zinc-700">{label}</span>
        </div>
        <ChevronRight className="text-zinc-400" size={18} />
    </button>
);


const ProfilePage = () => {
    const handleMenuClick = (label: string) => {
        alert(`Halaman "${label}" belum tersedia.`);
    };

  const menuItems = [
    { icon: User, label: "Edit Profil", action: () => handleMenuClick("Edit Profil") },
    { icon: Settings, label: "Pengaturan", action: () => handleMenuClick("Pengaturan") },
    { icon: Shield, label: "Keamanan & Privasi", action: () => handleMenuClick("Keamanan & Privasi") },
    { icon: HelpCircle, label: "Pusat Bantuan", action: () => handleMenuClick("Pusat Bantuan") },
  ];

  const handleLogout = () => {
      alert("Anda yakin ingin keluar?");
  }

  return (
    <div className="pb-24">
        <div className="-mx-6 p-6 bg-zinc-800 text-white rounded-b-3xl">
            <div className="flex items-center gap-4 mb-6 pt-8">
                <img src="/placeholder-5.avif" alt="User" className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"/>
                <div>
                    <h2 className="text-xl font-bold">Sultan Perkasa</h2>
                    <p className="text-sm text-zinc-300">0812-3456-7890</p>
                </div>
            </div>
            <WalletCard />
        </div>

        <div className="p-6 space-y-3">
            <div className="space-y-3">
                {menuItems.map((item, i) => <MenuItem key={i} {...item} />)}
            </div>

            <div className="pt-4">
                 <MenuItem icon={LogOut} label="Keluar Akun" action={handleLogout} />
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;
