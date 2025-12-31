import { Ticket } from 'lucide-react';
import Image from 'next/image';

const PromoCard = ({ title, subtitle, company, image }: any) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden flex items-center gap-4 p-3 active:bg-gray-100 transition-colors">
    <Image src={image} alt={title} width={80} height={80} className="w-20 h-20 rounded-lg object-cover" />
    <div className="flex-grow">
      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{company}</p>
      <h3 className="text-sm font-black text-zinc-800 leading-tight mt-1">{title}</h3>
      <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
    </div>
    <button className="self-start">
        <Ticket className="text-orange-500" />
    </button>
  </div>
);

const PromoPage = () => {
  const promos = [
    { title: "Diskon 50% SultanRide", subtitle: "Keliling kota lebih hemat", company: "SultanRide", image: "/placeholder-1.avif" },
    { title: "Cashback 30% SultanFood", subtitle: "Pesan makanan favoritmu", company: "SultanFood", image: "/placeholder-2.avif" },
    { title: "Gratis Ongkir SultanSend", subtitle: "Kirim barang tanpa biaya", company: "SultanSend", image: "/placeholder-3.avif" },
    { title: "Voucher SultanCar", subtitle: "Perjalanan nyaman dan aman", company: "SultanCar", image: "/placeholder-4.avif" },
  ];

  return (
    <div className="p-6 space-y-4">
        <h2 className="text-xl font-black italic text-zinc-900 uppercase">Promo & Diskon</h2>
        <div className="space-y-3">
            {promos.map((promo, i) => <PromoCard key={i} {...promo} />)}
        </div>
    </div>
  );
};

export default PromoPage;
