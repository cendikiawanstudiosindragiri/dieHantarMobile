'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function AuthStatus() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link href="/" className="text-gray-600 hover:text-orange-500">Beranda</Link></li>
        <li><Link href="/lacak" className="text-gray-600 hover:text-orange-500">Lacak Pesanan</Link></li>
        {user ? (
          <>
            <li><Link href="/pesan" className="text-gray-600 hover:text-orange-500">Pesan Sekarang</Link></li>
            <li><button onClick={handleSignOut} className="text-gray-600 hover:text-orange-500">Keluar</button></li>
          </>
        ) : (
          <li><Link href="/masuk" className="text-gray-600 hover:text-orange-500">Masuk</Link></li>
        )}
      </ul>
    </nav>
  );
}
