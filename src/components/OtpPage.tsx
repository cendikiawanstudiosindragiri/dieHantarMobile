'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const OtpPage = ({ 
    onOtpSuccess,
    confirmationResult,
    onBack,
    onResendOtp,
    phoneNumber,
    loading,
    error
}: { 
    onOtpSuccess: () => void; 
    confirmationResult: any;
    onBack: () => void;
    onResendOtp: () => void;
    phoneNumber: string;
    loading: boolean;
    error: string;
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [verificationError, setVerificationError] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer untuk cooldown kirim ulang
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (isNaN(Number(value))) return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '')) {
        handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (finalOtp: string) => {
    setVerificationError('');
    setVerificationLoading(true);
    try {
        if (!confirmationResult) {
            throw new Error("Objek konfirmasi tidak ditemukan.");
        }
        await confirmationResult.confirm(finalOtp);
        onOtpSuccess();
    } catch (err) {
        console.error("Error verifikasi OTP:", err);
        setVerificationError("Kode OTP salah atau tidak valid.");
        setOtp(new Array(6).fill("")); 
        inputRefs.current[0]?.focus();
    } finally {
        setVerificationLoading(false);
    }
  };

  const handleResend = () => {
      if (resendCooldown === 0) {
          onResendOtp();
          setResendCooldown(60); // Reset cooldown
      }
  }

  // Format nomor telepon untuk ditampilkan
  const displayPhoneNumber = phoneNumber ? `(${phoneNumber.slice(0, 5)}...${phoneNumber.slice(-4)})` : '';

  return (
    <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm p-8 space-y-6 text-center"
    >
        <div className="relative flex items-center justify-center">
            <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2">
                <ChevronLeft className="text-zinc-500" />
            </button>
            <h2 className="text-xl font-bold text-zinc-800">Verifikasi OTP</h2>
        </div>

        <p className="text-zinc-500">
          Masukkan 6 digit kode yang dikirimkan ke nomor {displayPhoneNumber}.
        </p>

      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((data, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="tel"
            maxLength={1}
            value={data}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            disabled={verificationLoading}
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-zinc-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition disabled:bg-zinc-100"
          />
        ))}
      </div>

      {(verificationError || error) && <p className="text-red-500 text-sm">{verificationError || error}</p>}
      
      <div className="pt-2">
        <button 
            onClick={() => handleSubmit(otp.join(''))} 
            disabled={verificationLoading || otp.join('').length !== 6}
            className="w-full py-3 text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-orange-300 transition-all"
        >
            {verificationLoading ? 'Memverifikasi...' : 'Verifikasi'}
        </button>
      </div>
      
      <p className="text-sm text-zinc-500">
        Tidak menerima kode? {' '} 
        <button 
            className="font-bold text-orange-500 hover:underline disabled:text-zinc-400 disabled:cursor-not-allowed"
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
        >
            {loading ? 'Mengirim...' : resendCooldown > 0 ? `Kirim Ulang dalam ${resendCooldown}s` : 'Kirim Ulang'}
        </button>
      </p>

    </motion.div>
  );
};

export default OtpPage;
