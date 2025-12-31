'use client';

import { AnimatePresence } from 'framer-motion';
import { useAuthGate } from '../hooks/useAuthGate';

import SplashScreen from '../components/SplashScreen';
import LoginPage from '../components/LoginPage';
import OtpPage from '../components/OtpPage';
import OnboardingPage from '../components/OnboardingPage';

export default function AuthenticationGate() {
  const { 
    currentStep, 
    loading,
    error,
    phoneNumber,
    confirmationResult,
    sendOtp,
    handleOtpSuccess, 
    handleOnboardingComplete,
    handleBack 
  } = useAuthGate();

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'splash' && <SplashScreen />}
      {currentStep === 'login' && (
        <div className="w-full min-h-screen flex items-center justify-center">
            <LoginPage 
              onSendOtp={sendOtp}
              loading={loading}
              error={error}
            />
        </div>
      )}
      {currentStep === 'otp' && (
        <div className="w-full min-h-screen flex items-center justify-center">
            <OtpPage 
                onOtpSuccess={handleOtpSuccess} 
                confirmationResult={confirmationResult}
                onBack={handleBack}
                onResendOtp={() => sendOtp(phoneNumber)} // Gunakan nomor yang sudah disimpan
                phoneNumber={phoneNumber}
                loading={loading}
                error={error}
            />
        </div>
      )}
      {currentStep === 'onboarding' && (
        <div className="w-full min-h-screen">
            <OnboardingPage onOnboardingComplete={handleOnboardingComplete} />
        </div>
      )}
    </AnimatePresence>
  );
}
