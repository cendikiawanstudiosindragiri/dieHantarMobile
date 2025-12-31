import { Wifi, PlusCircle, Send, QrCode, History } from "lucide-react";
import { FaCcMastercard } from "react-icons/fa";

const WalletCard = () => {
    return (
        <div className="p-6 space-y-8 pb-24">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-black italic text-zinc-900 uppercase">Financial Hub</h2>
            </div>

            <div className="wallet-card p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden h-52 flex flex-col justify-between border border-white/10 shadow-orange-900/30">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-[8px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">dieHantar Platinum</p>
                        <Wifi className="rotate-90 text-xl text-white/30" />
                    </div>
                    <FaCcMastercard className="text-3xl opacity-80" />
                </div>
                <div className="relative z-10">
                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Saldo Sultan</p>
                    <h2 className="text-3xl font-black italic tracking-tighter">Rp 1.234.567</h2>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                <button className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600 active:bg-gray-50"><PlusCircle /></div>
                    <span className="text-[8px] font-bold text-gray-500">Top Up</span>
                </button>
                <button className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 active:bg-gray-50"><Send /></div>
                    <span className="text-[8px] font-bold text-gray-500">Transfer</span>
                </button>
                <button className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600 active:bg-gray-50"><QrCode /></div>
                    <span className="text-[8px] font-bold text-gray-500">Scan</span>
                </button>
                <button className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400 active:bg-gray-50"><History /></div>
                    <span className="text-[8px] font-bold text-gray-500">History</span>
                </button>
            </div>
        </div>
    );
};

export default WalletCard;
