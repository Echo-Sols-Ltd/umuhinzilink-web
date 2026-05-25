'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FarmerGuard from '@/contexts/guard/FarmerGuard';

function NewRequest() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    requestDate: '',
    paymentType: 'credit',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.item || !formData.quantity || !formData.requestDate) {
      setErrorMsg('Please fill all required fields.');
      return;
    }

    setErrorMsg('');
    setLoading(true);


  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg bg-card p-6 rounded-lg shadow-md border border-border">
        <h1 className="text-2xl font-semibold mb-6 text-foreground text-center">
          Request Agri-Inputs on Credit
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Fill in the details below to request agricultural inputs from suppliers.
        </p>

        {/* Success/Error Messages */}
        {successMsg && (
          <div className="bg-success/10 text-success p-3 rounded mb-4 border border-success/20">{successMsg}</div>
        )}
        {errorMsg && <div className="bg-destructive/10 text-destructive p-3 rounded mb-4 border border-destructive/20">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="item"
            label="Item Name"
            value={formData.item}
            onChange={handleChange}
            placeholder="e.g., Maize Seeds"
            required
          />
          <Input
            name="quantity"
            label="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 50kg"
            required
          />
          <Input
            type="date"
            name="requestDate"
            label="Request Date"
            value={formData.requestDate}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block mb-1 font-medium text-foreground">Payment Type</label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className="w-full border border-border bg-card px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-success focus:border-success"
            >
              <option value="credit">Credit</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-primary-foreground font-medium transition-colors ${loading ? 'bg-success/50 cursor-not-allowed' : 'bg-success hover:bg-success/90'
              }`}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}


export default function NewRequestPage() {
  return (
    <FarmerGuard>
      <NewRequest />
    </FarmerGuard>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block mb-1 font-medium text-foreground">{label}</label>
      <input
        {...props}
        className="w-full border border-border bg-card px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-success focus:border-success"
      />
    </div>
  );
}
