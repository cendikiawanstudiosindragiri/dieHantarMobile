
export default function LacakPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Lacak Pesanan Anda</h2>
          <p className="text-gray-600 mb-8 text-center">Masukkan nomor pelacakan Anda di bawah ini untuk melihat status pesanan Anda.</p>
          <form>
            <div className="mb-4">
              <label htmlFor="trackingNumber" className="block text-gray-700 font-bold mb-2">Nomor Pelacakan</label>
              <input type="text" id="trackingNumber" name="trackingNumber" className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-orange-500" placeholder="e.g., DH123456789" />
            </div>
            <div className="text-center">
              <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600">Lacak</button>
            </div>
          </form>
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
