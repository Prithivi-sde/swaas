'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Section = 'iff' | 'products';

interface HeaderProps {
  productCount: number;
}

export const Header: React.FC<HeaderProps> = ({ productCount }) => {
  const [activeSection, setActiveSection] = useState<Section>('products');

  return (
    <header className="border-b px-6 flex items-center justify-between bg-white shadow-sm">
      <nav className="space-x-4 font-medium text-sm flex items-center">
        <button
          className="px-3 py-4 rounded"
        >
          IFF
        </button>

        <Link
          href="/products"
          onClick={() => setActiveSection('products')}
          className={`relative flex items-center px-3 py-4 rounded ${
            activeSection === 'products' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Products
          <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-gray-600 rounded-full">
            {productCount}
          </span>
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href="#" className="text-sm text-gray-700 hover:underline">
          Log out
        </Link>
      </div>
    </header>
  );
};
