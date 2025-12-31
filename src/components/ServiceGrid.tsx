import { Bike, Car, Utensils, Package } from "lucide-react";

const services = [
  { icon: Bike, label: "SultanRide", color: "text-green-500", bgColor: "bg-green-50" },
  { icon: Car, label: "SultanCar", color: "text-blue-500", bgColor: "bg-blue-50" },
  { icon: Utensils, label: "SultanFood", color: "text-red-500", bgColor: "bg-red-50" },
  { icon: Package, label: "SultanSend", color: "text-yellow-500", bgColor: "bg-yellow-50" },
];

const ServiceGrid = () => {
  const handleServiceClick = (serviceLabel: string) => {
    alert(`Anda memilih layanan: ${serviceLabel}`);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-zinc-900 uppercase italic">Layanan Sultan</h3>
            <button 
                onClick={() => alert('Halaman \'Semua Layanan\' belum tersedia.')} 
                className="text-[10px] font-bold text-orange-600"
            >
                Lihat Semua
            </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {services.map((service, index) => (
            <button 
                key={index} 
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                onClick={() => handleServiceClick(service.label)}
            >
              <div className={`w-full aspect-square ${service.bgColor} rounded-2xl flex items-center justify-center ${service.color}`}>
                  <service.icon size={24} />
              </div>
              <span className="text-[9px] font-bold text-zinc-700 text-center">{service.label}</span>
            </button>
          ))}
        </div> 
    </div>
  );
};

export default ServiceGrid;
