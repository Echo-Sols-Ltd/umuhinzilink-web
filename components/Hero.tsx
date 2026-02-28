import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-success/10 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground">
            Connect Farmers to <span className="text-success">Digital Markets</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Empowering smallholder farmers in Rwanda with Technology to access markets, get
            AI-powered farming advice and secure agricultural loans
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <a href="#" className="bg-success text-primary-foreground px-5 py-2 rounded-md hover:bg-success/90">
              Get Started
            </a>
            <a
              href="#"
              className="border border-border text-foreground px-5 py-2 rounded-md hover:bg-muted"
            >
              View Demo
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex space-x-10">
            <div>
              <p className="text-success text-2xl font-semibold">500+</p>
              <p className="text-muted-foreground text-sm">Registered Farmers</p>
            </div>
            <div>
              <p className="text-purple-600 text-2xl font-semibold">50+</p>
              <p className="text-muted-foreground text-sm">Input Suppliers</p>
            </div>
            <div>
              <p className="text-info text-2xl font-semibold">1000+</p>
              <p className="text-muted-foreground text-sm">Transactions Completed</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/hero.png"
              alt="Farmer using digital technology in the field"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
