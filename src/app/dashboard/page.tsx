'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import ServiceGrid from "../components/ServiceGrid";
import StoryCircle from "../components/StoryCircle";
import Image from 'next/image';

// Import the new page components
import PromoPage from '../components/PromoPage';
import HistoryPage from '../components/HistoryPage';
import ProfilePage from '../components/ProfilePage';

const stories = [
    { name: "Promo Spesial", img: "/placeholder-1.avif", isLive: true },
    { name: "Voucher Anda", img: "/placeholder-2.avif" },
    { name: "Mission X", img: "/placeholder-3.avif" },
    { name: "SultanFood", img: "/placeholder-4.avif" },
    { name: "SultanMart", img: "/placeholder-5.avif" },
];

const HomePageContent = () => (
    <div className="p-6 space-y-6">
        <div className="-mx-6 px-6">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {stories.map((story, index) => (
                    <StoryCircle key={index} name={story.name} img={story.img} isLive={story.isLive} />
                ))}
            </div>
        </div>
        <div className="w-full h-40 rounded-[2rem] shimmer overflow-hidden relative border border-gray-100 shadow-sm">
            <Image src="/promo-banner.avif" alt="Promo Banner" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 bg-black/20">
                <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-1 rounded w-max mb-2">HOT PROMO</span>
                <h2 className="text-2xl font-black text-white italic drop-shadow-lg">SIAP ANTAR <br/>SAMPAI TUJUAN</h2>
            </div>
        </div>
        <ServiceGrid />
        <div className="bg-zinc-900 p-6 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="radar-effect"></div>
            <h4 className="text-xs font-black italic uppercase mb-1">Status Driver Terdekat</h4>
            <p className="text-[9px] text-zinc-400 font-bold">12 Driver Sultan sedang standby di Indragiri Hilir.</p>
        </div>
    </div>
);

export default function Home() {
  const [activePage, setActivePage] = useState('home');

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePageContent />;
      case 'promo':
        return <PromoPage />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePageContent />;
    }
  }

  return (
    <>
        {activePage !== 'profile' && <Header />}
        
        <main className="scroll-container no-scrollbar">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activePage}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="page-content"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </main>
        
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </>
  );
}
