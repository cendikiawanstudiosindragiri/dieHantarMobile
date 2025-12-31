import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-black text-white italic">
          die<span className="text-orange-500">Hantar</span>
        </h1>
        <p className="text-center text-zinc-400 font-bold text-sm mt-1">Sultan Super App</p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
