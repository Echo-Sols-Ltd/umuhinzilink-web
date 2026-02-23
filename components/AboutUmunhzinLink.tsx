import React from 'react';
import { CheckIcon } from 'lucide-react';

const AboutUmuhinzinLink: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto px-6 md:px-12 py-12 gap-36">
      {/* Left side*/}
      <div className="relative flex-shrink-0">
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden">
          <img
            src="/about1.png"
            alt="Smiling woman holding fresh vegetables"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 transform translate-x-[-25%] translate-y-[25%] w-[200px] h-[200px] md:w-[230px] md:h-[230px] rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
          <img
            src="/about2.png"
            alt="Basket with fresh tomatoes"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="max-w-xl">
        <p className="text-sm text-green-600 font-semibold mb-2 border border-gray-300  w-52 px-5 py-2 rounded-md">
          About UmuhinzinLink
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">
          Bridging the Gap Between Farmers and Markets
        </h2>
        <p className="text-gray-700 mb-8">
          UmuhinzinLink is Rwanda&apos;s first comprehensive digital agriculture platform, designed
          specifically for smallholder farmers. We combine cutting-edge technology with deep
          understanding of local farming practices to create sustainable solutions.
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-3">
            <span className="inline-block mt-1 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-gray-700">Market Access</p>
              <p className="text-gray-600 text-sm">Direct connection to buyers and fair pricing</p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="inline-block mt-1 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-gray-700">AI-Powered Advice</p>
              <p className="text-gray-600 text-sm">
                Smart farming recommendations in local language
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <span className="inline-block mt-1 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckIcon className="w-4 h-4" />
            </span>
            <div>
              <p className="font-semibold text-gray-700">Financial Inclusion</p>
              <p className="text-gray-600 text-sm">Access to agricultural loans and credit</p>
            </div>
          </li>
        </ul>

        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition cursor-pointer">
          Learn More
        </button>
      </div>
    </section>
  );
};

export default AboutUmuhinzinLink;
