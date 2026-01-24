'use client';

import { Heading, Text, List, ListItem, TypographySection } from '@/components/ui/typography';

const LucideIcons = {
  Phone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h2.5a1 1 0 011 .78l1 4a1 1 0 01-.25.92l-1.5 1.5a16 16 0 006.72 6.72l1.5-1.5a1 1 0 01.92-.25l4 1a1 1 0 01.78 1V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
      />
    </svg>
  ),
  Leaf: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13c0 5 4 9 9 9s9-4 9-9-4-9-9-9H5v9z"
      />
    </svg>
  ),
  CreditCard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  ChartBar: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  ClipboardList: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 5h6M9 3h6v2H9z" />
      <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
      <path d="M9 9h6M9 13h6M9 17h6" />
    </svg>
  ),
  Users: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M17 21v-2a4 4 0 00-3-3.87" />
      <path d="M9 21v-2a4 4 0 013-3.87" />
      <path d="M7 4a4 4 0 100 8 4 4 0 000-8z" />
      <path d="M17 4a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  Search: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Lock: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
};

export default function WhoWeServe() {
  const data = [
    {
      title: 'Farmers',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      items: [
        { icon: LucideIcons.Phone, text: 'Mobile OTP & Kinyarwanda support' },
        { icon: LucideIcons.Leaf, text: 'AI-powered agronomy tips' },
        { icon: LucideIcons.CreditCard, text: 'Credit access for inputs' },
        { icon: LucideIcons.ChartBar, text: 'Market price trends' },
      ],
    },
    {
      title: 'Suppliers',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      items: [
        { icon: LucideIcons.ClipboardList, text: 'List agri-inputs & inventory' },
        { icon: LucideIcons.Users, text: 'Farmer demand matching' },
        { icon: LucideIcons.CreditCard, text: 'Credit request management' },
        { icon: LucideIcons.ChartBar, text: 'Sales tracking & analytics' },
      ],
    },
    {
      title: 'Buyers',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      items: [
        { icon: LucideIcons.Search, text: 'Browse fresh produce' },
        { icon: LucideIcons.ClipboardList, text: 'Filter by region & price' },
        { icon: LucideIcons.Phone, text: 'Direct farmer contact' },
        { icon: LucideIcons.Lock, text: 'Secure payment processing' },
      ],
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <TypographySection spacing="normal" className="text-center mb-8">
          <Heading variant="h2" className="mb-2">
            Who We Serve
          </Heading>
          <Text variant="body" color="muted">
            Three interconnected communities driving agricultural growth
          </Text>
        </TypographySection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(group => (
            <div key={group.title} className={`${group.color} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow`}>
              <Heading variant="h4" className="mb-4">
                {group.title}
              </Heading>
              
              <List variant="none" spacing="normal">
                {group.items.map((item, idx) => (
                  <ListItem key={idx} icon={<span className={group.iconColor}>{item.icon}</span>}>
                    <Text variant="body-sm" color="secondary">
                      {item.text}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
