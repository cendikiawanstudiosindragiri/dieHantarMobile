'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function DaftarPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Buat Akun Baru</h2>
          <p className="text-gray-600 mb-8 text-center">Daftar untuk mulai mengirim dengan Die Hantar.</p>
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-orange-500" 
                placeholder="Nama Anda" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-orange-500" 
                placeholder="Anda@contoh.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Kata Sandi</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-orange-500" 
                placeholder="Kata sandi Anda" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="text-center">
              <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600">Daftar</button>
            </div>
          </form>
          <p className="text-center text-gray-600 mt-4">Sudah punya akun? <Link href="/masuk" className="text-orange-500 hover:underline">Masuk di sini</Link></p>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Die Hantar. Semua Hak Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
