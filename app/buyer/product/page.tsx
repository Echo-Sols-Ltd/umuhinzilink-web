'use client';

import { useState } from 'react';
import {
  Star,
  MapPin,
  User as UserIcon,
  Search,
  LayoutGrid,
  List,
  CheckCircle,
  LayoutGrid as GridIcon,
  FilePlus,
  MessageSquare,
  Mail,
  Heart,
  Phone,
  Settings,
  LogOut,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import BuyerSidebar from '@/components/buyer/Navbar';
import { BuyerPages } from '@/types';
import BuyerGuard from '@/contexts/guard/BuyerGuard';


const productsList = [
  {
    name: 'Fresh Tomatoes',
    price: '$2.50/kg',
    available: '500 kg',
    farmer: 'Mary Uwimana',
    location: 'Kigali',
    rating: 4.8,
    image: '/tomatoes.png',
    farmerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Organic Lettuce',
    price: '$1.80/kg',
    available: '200 kg',
    farmer: 'Jean Baptiste',
    location: 'Musanze',
    rating: 4.6,
    image: '/lettuce.png',
    farmerImage: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Yellow Maize',
    price: '$0.85/kg',
    available: '2000 kg',
    farmer: 'Pierre Nkurunziza',
    location: 'Huye',
    rating: 4.9,
    image: '/maize.png',
    farmerImage: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    name: 'Fresh Carrots',
    price: '$1.20/kg',
    available: '300 kg',
    farmer: 'Agnes Mukamana',
    location: 'Kigali',
    rating: 4.7,
    image: '/carrots.png',
    farmerImage: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    name: 'Red Apples',
    price: '$3.50/kg',
    available: '150 kg',
    farmer: 'Grace Uwase',
    location: 'Musanze',
    rating: 4.8,
    image: '/apples.png',
    farmerImage: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    name: 'Green Beans',
    price: '$2.20/kg',
    available: '180 kg',
    farmer: 'Samuel Habimana',
    location: 'Nyagatare',
    rating: 4.5,
    image: '/green-beans.png',
    farmerImage: 'https://randomuser.me/api/portraits/men/49.jpg',
  },
];

const Logo = () => (
  <span className="font-extrabold text-2xl tracking-tight">
    <span className="text-green-700">Umuhinzi</span>
    <span className="text-black">Link</span>
  </span>
);

function ProductsPageComponent() {
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All Crops');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [logoutPending, setLogoutPending] = useState(false);
  const router = useRouter();

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCrop = cropFilter === 'All Crops' || p.name.includes(cropFilter);
    const matchesLocation =
      locationFilter === 'All Locations' || p.location.includes(locationFilter);
    return matchesSearch && matchesCrop && matchesLocation;
  });

  const handleLogout = async () => {

  };

  return (
    <div className="flex flex-row h-screen bg-gray-50 overflow-hidden">
    
      <BuyerSidebar
        activePage={BuyerPages.PRODUCT}
        handleLogout={handleLogout}
        logoutPending={logoutPending}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-72 m-12 overflow-auto">
        {/* Search + Filter Bar */}
        <div className="border-b px-6 py-4 flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search crops..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded pl-9 pr-3 py-2 text-sm text-gray-600"
            />
          </div>

          <select
            className="border rounded px-3 py-2 text-sm cursor-pointer text-gray-600"
            value={cropFilter}
            onChange={e => setCropFilter(e.target.value)}
          >
            <option>All Crops</option>
            <option>Tomatoes</option>
            <option>Lettuce</option>
            <option>Maize</option>
            <option>Carrots</option>
          </select>

          <select
            className="border rounded px-3 py-2 text-sm cursor-pointer text-gray-600"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          >
            <option>All Locations</option>
            <option>Kigali</option>
            <option>Musanze</option>
            <option>Huye</option>
            <option>Nyagatare</option>
          </select>

          <select className="border rounded px-3 py-2 text-sm cursor-pointer text-gray-600">
            <option>Price Range</option>
          </select>

          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
            Filter
          </button>
        </div>

        {/* Products Grid */}
        <main className="flex-1 overflow-auto p-6">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing 1-{filteredProducts.length} of {productsList.length} results
            </p>
            <div className="flex gap-2 text-gray-500">
              <LayoutGrid className="w-5 h-5 cursor-pointer hover:text-green-600" />
              <List className="w-5 h-5 cursor-pointer hover:text-green-600" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <div key={p.name} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-700">{p.name}</h3>
                  <p className="text-green-600 font-bold">{p.price}</p>
                  <p className="text-sm text-gray-500">Available: {p.available}</p>

                  {/* Farmer Info */}
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <img
                      src={p.farmerImage}
                      alt={p.farmer}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span>{p.farmer}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" /> {p.location}
                    <div className="flex items-center gap-1 text-yellow-500 mt-1 ml-56">
                      <Star className="w-4 h-4" /> {p.rating}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    {/* Buy Now */}
                    <button className="bg-green-600 text-white px-3 py-1 cursor-pointer rounded text-sm w-full">
                      Buy Now
                    </button>

                    {/* Contact + Heart side-by-side */}
                    <div className="flex gap-2">
                      <button className="border border-gray-300 px-3 cursor-pointer py-1 rounded text-sm flex-grow text-gray-600">
                        Contact
                      </button>
                      <button className="border border-gray-300 p-2 cursor-pointer rounded text-sm flex items-center justify-center text-gray-600">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <BuyerGuard>
      <ProductsPageComponent />
    </BuyerGuard>
  );
}
