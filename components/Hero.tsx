import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Connect Farmers to <span className="text-green-600">Digital Markets</span>
          </h1>
          <p className="mt-4 text-gray-700 max-w-lg">
            Empowering smallholder farmers in Rwanda with Technology to access markets, get
            AI-powered farming advice and secure agricultural loans
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <a href="#" className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
              Get Started
            </a>
            <a
              href="#"
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-100"
            >
              View Demo
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex space-x-10">
            <div>
              <p className="text-green-600 text-2xl font-bold">500+</p>
              <p className="text-gray-600 text-sm">Registered Farmers</p>
            </div>
            <div>
              <p className="text-purple-600 text-2xl font-bold">50+</p>
              <p className="text-gray-600 text-sm">Input Suppliers</p>
            </div>
            <div>
              <p className="text-blue-600 text-2xl font-bold">1000+</p>
              <p className="text-gray-600 text-sm">Transactions Completed</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/hero.png"
              alt="Farmer using digital technology in the field"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
