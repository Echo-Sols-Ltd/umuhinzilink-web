'use client';

export default function ImpactStories() {
  const metrics = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M16 21v-2a4 4 0 0 0-8 0v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      value: '500+',
      label: 'Registered Farmers',
    },
    {
      value: '50+',
      label: 'Active Suppliers',
    },
    {
      value: '30%',
      label: 'Average Yield Increase',
    },
    {
      value: '$50K',
      label: 'Total Transactions',
    },
  ];

  const testimonials = [
    {
      name: 'Marie Uwimana',
      role: 'Maize Farmer, Nyagatare',
      quote:
        'UmuhinziLink helped me sell my maize directly to buyers at better prices. The SMS tips improved my harvest by 30%.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Jean Baptiste',
      role: 'Bean Farmer, Nyagatare',
      quote:
        'Getting credit for seeds through the platform was game-changing. Now I can plan my seasons better.',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      name: 'Agnes Mukamana',
      role: 'Vegetable Farmer, Nyagatare',
      quote:
        "The AI chatbot in Kinyarwanda answers all my farming questions. It's like having an expert in my pocket.",
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-gray-900">Impact & Success Stories</h2>
        <p className="text-center text-gray-600 mt-2">
          Real farmers, real results from our Nyagatare pilot
        </p>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white shadow-md rounded-lg p-4">
              {/* Profile */}
              <div className="flex items-center mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
              {/* Quote */}
              <p className="text-gray-800 text-sm italic">“{t.quote}”</p>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-8">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="text-lg font-semibold mt-2 text-green-600 ">{m.value}</p>
              <p className="text-gray-600 text-sm">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
