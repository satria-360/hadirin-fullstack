import React, { useEffect, useState } from 'react';

export default function FiturPage() {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/fitur')
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch((err) => console.error('API Error:', err));
  }, []);

  return (
    <main className="w-full pt-10 flex flex-col items-center relative">
      <div className="w-full max-w-4xl space-y-8 px-6 pb-20">
        <h1 className="text-3xl font-bold text-center mb-8">Fitur Utama</h1>
        {features.map((item, index) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className={`space-y-2 text-left ${index % 2 !== 0 ? 'order-2 md:order-1' : ''}`}>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.description}</p>
            </div>
            <div className={`h-40 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 ${index % 2 !== 0 ? 'order-1 md:order-2' : ''}`}>
              <span className="text-xs text-gray-400">[ Preview {item.title} ]</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}