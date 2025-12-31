'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  {
    image: "/placeholder-6.avif",
    title: "Selamat Datang di dieHantar!",
    description: "Aplikasi Super untuk semua kebutuhan pengiriman dan gaya hidup Anda."
  },
  {
    image: "/placeholder-7.avif",
    title: "Pesan Transportasi & Makanan",
    description: "Pesan SultanRide atau SultanCar, dan nikmati kuliner favoritmu dengan SultanFood."
  },
  {
    image: "/placeholder-8.avif",
    title: "Pembayaran Mudah & Aman",
    description: "Isi ulang saldo SultanPay Anda untuk transaksi yang cepat dan tanpa ribet."
  }
];

const OnboardingPage = ({ onOnboardingComplete }: { onOnboardingComplete: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center p-8 bg-zinc-900 text-white">
        <div className="w-full text-center pt-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <img src={slides[currentSlide].image} className="w-full h-64 object-cover rounded-2xl mb-8"/>
                    <h2 className="text-2xl font-bold mb-2">{slides[currentSlide].title}</h2>
                    <p className="text-zinc-300 max-w-xs mx-auto">{slides[currentSlide].description}</p>
                </motion.div>
            </AnimatePresence>
        </div>

        <div className="w-full flex items-center justify-between pb-8">
            {currentSlide > 0 ? (
                <button onClick={handlePrev} className="p-3 rounded-full bg-zinc-800 active:bg-zinc-700">
                    <ArrowLeft size={20}/>
                </button>
            ) : <div/>}

            <div className="flex gap-2">
                {slides.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === currentSlide ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                ))}
            </div>

            {currentSlide === slides.length - 1 ? (
                 <button onClick={onOnboardingComplete} className="py-3 px-6 bg-orange-500 font-bold rounded-full active:scale-95 transition-all">
                    Mulai Sekarang
                </button>
            ) : (
                <button onClick={handleNext} className="p-3 rounded-full bg-orange-500 active:scale-95">
                    <ArrowRight size={20}/>
                </button>
            )}
        </div>
    </div>
  );
};

export default OnboardingPage;
