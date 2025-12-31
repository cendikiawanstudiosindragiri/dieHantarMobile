import { Bike, Utensils, Package } from 'lucide-react';

const serviceIcons: any = {
    SultanRide: Bike,
    SultanFood: Utensils,
    SultanSend: Package,
}

const HistoryItem = ({ service, date, status, price, destination }: any) => {
    const Icon = serviceIcons[service];
    const isCompleted = status === 'Selesai';

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 active:bg-gray-100 transition-colors">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                <Icon size={24} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-zinc-800">{service}</h3>
                    <p className={`text-xs font-bold ${isCompleted ? 'text-green-600' : 'text-orange-600'}`}>{status}</p>
                </div>
                <p className="text-xs text-zinc-500">{destination}</p>
                <p className="text-xs text-zinc-400 mt-1">{date} - <span className="font-semibold text-zinc-600">Rp {price}</span></p>
            </div>
        </div>
    )
};

const HistoryPage = () => {
  const history = [
    { service: "SultanRide", date: "20 Mei 2024", status: "Selesai", price: "15.000", destination: "Grand Indonesia Mall" },
    { service: "SultanFood", date: "19 Mei 2024", status: "Selesai", price: "85.000", destination: "Rumah" },
    { service: "SultanSend", date: "18 Mei 2024", status: "Dibatalkan", price: "10.000", destination: "Kantor" },
    { service: "SultanRide", date: "17 Mei 2024", status: "Selesai", price: "25.000", destination: "Blok M Square" },
  ];

  return (
    <div className="p-6 space-y-4">
        <h2 className="text-xl font-black italic text-zinc-900 uppercase">Riwayat Pesanan</h2>
        <div className="space-y-3">
            {history.map((item, i) => <HistoryItem key={i} {...item} />)}
        </div>
    </div>
  );
};

export default HistoryPage;
