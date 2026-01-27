'use client';

import React from 'react';

export default function AgriculturalDesignTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="typography-display text-agricultural-primary mb-4">
            Agricultural Design System Test
          </h1>
          <p className="typography-lead text-gray-600">
            Testing the new earth-tone green primary colors with complementary earth tones and fresh accent colors
          </p>
        </div>

        {/* Primary Agricultural Colors */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-agricultural-primary">Primary Agricultural Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-agricultural-primary rounded-organic mb-3"></div>
              <p className="typography-label">Primary</p>
              <p className="typography-caption text-gray-500">#2D5016</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-agricultural-light rounded-organic mb-3"></div>
              <p className="typography-label">Light</p>
              <p className="typography-caption text-gray-500">#4A7C59</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-agricultural-green-400 rounded-organic mb-3"></div>
              <p className="typography-label">400</p>
              <p className="typography-caption text-gray-500">#7FB069</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-agricultural-green-200 rounded-organic mb-3"></div>
              <p className="typography-label">200</p>
              <p className="typography-caption text-gray-500">#B8E6B8</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-agricultural-green-100 rounded-organic mb-3"></div>
              <p className="typography-label">100</p>
              <p className="typography-caption text-gray-500">#D4F1D4</p>
            </div>
          </div>
        </section>

        {/* Earth Tone Colors */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-earth-brown">Earth Tone Complementary Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="agricultural-card">
              <h3 className="typography-h4 text-earth-brown mb-4">Earth Brown</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-earth-brown rounded-organic"></div>
                  <span className="typography-body">Default (#8B4513)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-earth-brown-light rounded-organic"></div>
                  <span className="typography-body">Light (#CD853F)</span>
                </div>
              </div>
            </div>
            <div className="agricultural-card">
              <h3 className="typography-h4 text-earth-ochre mb-4">Earth Ochre</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-earth-ochre rounded-organic"></div>
                  <span className="typography-body">Default (#CC7722)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-earth-ochre-light rounded-organic"></div>
                  <span className="typography-body">Light (#E6A055)</span>
                </div>
              </div>
            </div>
            <div className="agricultural-card">
              <h3 className="typography-h4 text-earth-clay mb-4">Earth Clay</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-earth-clay rounded-organic"></div>
                  <span className="typography-body">Default (#B87333)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-earth-clay-light rounded-organic"></div>
                  <span className="typography-body">Light (#D4965C)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fresh Accent Colors */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-harvest-gold">Fresh Accent Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-harvest-gold rounded-organic mb-3"></div>
              <p className="typography-label text-harvest-gold">Harvest Gold</p>
              <p className="typography-caption text-gray-500">#FFD700</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-sunrise-orange rounded-organic mb-3"></div>
              <p className="typography-label text-sunrise-orange">Sunrise Orange</p>
              <p className="typography-caption text-gray-500">#FF8C42</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-sky-blue rounded-organic mb-3"></div>
              <p className="typography-label text-sky-blue">Sky Blue</p>
              <p className="typography-caption text-gray-500">#87CEEB</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-soil-rich rounded-organic mb-3"></div>
              <p className="typography-label text-soil-rich">Soil Rich</p>
              <p className="typography-caption text-gray-500">#654321</p>
            </div>
          </div>
        </section>

        {/* Semantic Colors */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-agricultural-primary">Semantic Agricultural Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-success rounded-organic mb-3"></div>
              <p className="typography-label text-success">Growth Success</p>
              <p className="typography-caption text-gray-500">#4A7C59</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-warning rounded-organic mb-3"></div>
              <p className="typography-label text-warning">Caution Yellow</p>
              <p className="typography-caption text-gray-500">#FFD700</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-error rounded-organic mb-3"></div>
              <p className="typography-label text-error">Alert Red</p>
              <p className="typography-caption text-gray-500">#DC143C</p>
            </div>
            <div className="agricultural-card text-center">
              <div className="w-full h-20 bg-info rounded-organic mb-3"></div>
              <p className="typography-label text-info">Info Blue</p>
              <p className="typography-caption text-gray-500">#87CEEB</p>
            </div>
          </div>
        </section>

        {/* Gradient Backgrounds */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-agricultural-primary">Agricultural Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-32 bg-gradient-primary rounded-organic flex items-center justify-center">
              <p className="typography-h4 text-white">Primary Gradient</p>
            </div>
            <div className="h-32 bg-gradient-earth rounded-organic flex items-center justify-center">
              <p className="typography-h4 text-white">Earth Gradient</p>
            </div>
            <div className="h-32 bg-gradient-harvest rounded-organic flex items-center justify-center">
              <p className="typography-h4 text-white">Harvest Gradient</p>
            </div>
            <div className="h-32 bg-gradient-natural rounded-organic flex items-center justify-center">
              <p className="typography-h4 text-agricultural-primary">Natural Gradient</p>
            </div>
            <div className="h-32 bg-gradient-success rounded-organic flex items-center justify-center">
              <p className="typography-h4 text-white">Success Gradient</p>
            </div>
            <div className="h-32 bg-gradient-info rounded-organic flex items-center justify-center">
              <p className="typography-h4 text-white">Info Gradient</p>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-agricultural-primary">Component Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Farm Product Card */}
            <div className="agricultural-card hover:shadow-agricultural-md transition-all duration-300">
              <div className="w-full h-32 bg-gradient-natural rounded-organic mb-4"></div>
              <h3 className="typography-h4 text-agricultural-primary mb-2">Fresh Tomatoes</h3>
              <p className="typography-body text-gray-600 mb-3">
                Organic tomatoes from Musanze district. Fresh harvest, perfect for cooking.
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="typography-h5 text-harvest-gold">2,500 RWF/kg</span>
                <span className="typography-caption text-success bg-success-bg px-2 py-1 rounded-organic-sm">
                  Fresh
                </span>
              </div>
              <button className="agricultural-button w-full">
                Contact Farmer
              </button>
            </div>

            {/* Sample Farmer Profile Card */}
            <div className="agricultural-card hover:shadow-earth-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-earth rounded-full mr-3"></div>
                <div>
                  <h3 className="typography-h5 text-agricultural-primary">Jean Baptiste</h3>
                  <p className="typography-caption text-gray-500">Verified Farmer</p>
                </div>
              </div>
              <p className="typography-body text-gray-600 mb-3">
                5 years experience in organic farming. Specializes in vegetables and fruits.
              </p>
              <div className="flex justify-between text-center">
                <div>
                  <p className="typography-h5 text-earth-ochre">4.8</p>
                  <p className="typography-caption text-gray-500">Rating</p>
                </div>
                <div>
                  <p className="typography-h5 text-success">156</p>
                  <p className="typography-caption text-gray-500">Sales</p>
                </div>
                <div>
                  <p className="typography-h5 text-info">2h</p>
                  <p className="typography-caption text-gray-500">Response</p>
                </div>
              </div>
            </div>

            {/* Sample Form */}
            <div className="agricultural-card">
              <h3 className="typography-h4 text-agricultural-primary mb-4">Contact Form</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your name" 
                  className="agricultural-input w-full"
                />
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="agricultural-input w-full"
                />
                <textarea 
                  placeholder="Your message" 
                  rows={3}
                  className="agricultural-input w-full resize-none"
                ></textarea>
                <button className="agricultural-button w-full">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Shadow Examples */}
        <section className="space-y-6">
          <h2 className="typography-h2 text-agricultural-primary">Shadow System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-organic shadow-agricultural-sm">
              <p className="typography-body text-center">Agricultural Small Shadow</p>
            </div>
            <div className="bg-white p-6 rounded-organic shadow-earth-md">
              <p className="typography-body text-center">Earth Medium Shadow</p>
            </div>
            <div className="bg-white p-6 rounded-organic shadow-warm-lg">
              <p className="typography-body text-center">Warm Large Shadow</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}