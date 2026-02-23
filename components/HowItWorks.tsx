import { FC } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Register',
    description: 'Sign up via mobile OTP or email. Quick and secure registration process.',
  },
  {
    number: 2,
    title: 'List & Request',
    description: 'List your produce or request agri-inputs on credit through our platform.',
  },
  {
    number: 3,
    title: 'Connect',
    description: 'Get matched with buyers, suppliers, and receive AI-powered farming advice.',
  },
  {
    number: 4,
    title: 'Grow',
    description: 'Manage transactions, track growth, and scale your farming operations.',
  },
];

const HowItWorks: FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold text-gray-900">How UmuhinziLink Works</h2>
        <p className="text-center text-gray-600 mt-2">
          Simple steps to transform your farming business
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-semibold mx-auto">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
