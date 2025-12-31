'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Fungsi untuk menyiapkan reCAPTCHA
const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {
        console.log("reCAPTCHA terverifikasi");
      }
    });
  }
}

export function useAuthGate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('splash');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Efek untuk splash screen
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => setCurrentStep('login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Fungsi terpusat untuk mengirim atau mengirim ulang OTP
  const sendOtp = async (number: string) => {
    setError('');
    setLoading(true);
    try {
      const formattedPhoneNumber = `+62${number.startsWith('0') ? number.substring(1) : number}`.replace(/\s|-/g, '');
      setPhoneNumber(formattedPhoneNumber); // Simpan nomor yang diformat
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setCurrentStep('otp');
      console.log("OTP terkirim, menunggu konfirmasi.");
    } catch (err) {
      console.error("Error saat mengirim OTP:", err);
      setError("Gagal mengirim OTP. Pastikan nomor telepon benar dan coba lagi.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId: any) => {
            // Pastikan grecaptcha ada sebelum dipanggil
            if (window.grecaptcha) {
                window.grecaptcha.reset(widgetId);
            }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    // Di dunia nyata, Anda akan memeriksa apakah pengguna ini baru
    // dengan memeriksa database Anda setelah verifikasi OTP berhasil.
    const isNewUser = true; 
    if (isNewUser) {
        setCurrentStep('onboarding');
    } else {
        router.push('/dashboard');
    }
  };

  const handleOnboardingComplete = () => {
    router.push('/dashboard');
  };

  // Kembali dari OTP ke layar Login
  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('login');
      setError(''); // Hapus error lama
    }
  }

  return { 
    currentStep, 
    loading,
    error,
    phoneNumber,
    confirmationResult,
    sendOtp,
    handleOtpSuccess, 
    handleOnboardingComplete,
    handleBack
  };
}

// Deklarasi tipe global untuk properti window
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        grecaptcha?: any;
    }
}
