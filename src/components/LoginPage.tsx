'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = ({ 
    onSendOtp,
    loading,
    error 
}: { 
    onSendOtp: (phoneNumber: string) => void; 
    loading: boolean;
    error: string;
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneNumber.length >= 9) { // Validasi dasar
        onSendOtp(phoneNumber);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 space-y-6"
    >
        {/* Container ini diperlukan agar reCAPTCHA dapat menemukan tempat untuk dirender */}
        <div id="recaptcha-container"></div>

        <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-800">Masuk atau Daftar</h2>
            <p className="text-zinc-500 mt-2">Masukkan nomor telepon Anda untuk melanjutkan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">+62</span>
                <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ''))} // Hanya izinkan angka
                    placeholder="812 3456 7890"
                    className="w-full pl-12 pr-3 py-3 border border-zinc-200 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition"
                    required
                />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 transition-all"
                >
                    {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
                </button>
            </div>
        </form>

         <p className="text-xs text-zinc-400 text-center">
            Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi kami.
        </p>
    </motion.div>
  );
};

export default LoginPage;
