'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/shared/Sidebar';
import { UserType } from '@/types';
import {
  CreditCard,
  ArrowLeft,
  Save,
  Smartphone,
  Building,
  Banknote,
  Shield,
  CheckCircle
} from 'lucide-react';

export default function PaymentsSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [payments, setPayments] = useState({
    mobile_money_provider: '',
    mobile_money_number: '',
    bank_account_number: '',
    bank_name: '',
    account_holder_name: '',
    preferred_payment_method: 'mobile_money',
    auto_withdrawal: false,
    payment_notifications: true
  });

  const handleChange = (key: keyof typeof payments, value: string | boolean) => {
    setPayments(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const mobileMoneyProviders = [
    { value: 'mtn_momo', label: 'MTN Mobile Money', color: 'bg-yellow-500', icon: '📱' },
    { value: 'airtel_money', label: 'Airtel Money', color: 'bg-red-500', icon: '📱' }
  ];

  const rwandaBanks = [
    'Bank of Kigali',
    'BCR - Commercial Bank of Rwanda',
    'Ecobank Rwanda',
    'KCB Bank Rwanda',
    'I&M Bank Rwanda',
    'Equity Bank Rwanda',
    'Access Bank Rwanda',
    'Cogebanque',
    'Unguka Bank',
    'BPR Bank Rwanda'
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userType={user?.role as UserType} activeItem="Settings" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Settings</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payments & Payouts</h1>
              <p className="text-muted-foreground mt-1">Configure how you receive payments</p>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="space-y-6">
            {/* Mobile Money Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Mobile Money Configuration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mobile Money Provider *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mobileMoneyProviders.map(provider => (
                      <label key={provider.value} className="relative">
                        <input
                          type="radio"
                          name="mobile_money_provider"
                          value={provider.value}
                          checked={payments.mobile_money_provider === provider.value}
                          onChange={(e) => handleChange('mobile_money_provider', e.target.value)}
                          className="sr-only peer"
                        />
                        <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-success peer-checked:bg-success/10 ${
                          payments.mobile_money_provider === provider.value ? 'border-success bg-success/10' : 'border-border hover:border-muted-foreground'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${provider.color} rounded-lg flex items-center justify-center text-white`}>
                              <span className="text-sm">{provider.icon}</span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{provider.label}</div>
                              <div className="text-xs text-muted-foreground">Fast and secure payments</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mobile Money Number *
                  </label>
                  <input
                    type="tel"
                    value={payments.mobile_money_number}
                    onChange={(e) => handleChange('mobile_money_number', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="07xxxxxxxx"
                    pattern="^07[2-9]\d{7}$"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: 07xxxxxxxx (Rwanda mobile number)
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Account Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <Building className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Bank Account Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bank Name
                  </label>
                  <select
                    value={payments.bank_name}
                    onChange={(e) => handleChange('bank_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    <option value="">Select Bank</option>
                    {rwandaBanks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={payments.account_holder_name}
                    onChange={(e) => handleChange('account_holder_name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={payments.bank_account_number}
                    onChange={(e) => handleChange('bank_account_number', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                    placeholder="Enter bank account number"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: For direct bank transfers
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Preferences */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                  <Banknote className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Payment Preferences</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred Payment Method
                  </label>
                  <select
                    value={payments.preferred_payment_method}
                    onChange={(e) => handleChange('preferred_payment_method', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
                  >
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">Auto Withdrawal</div>
                      <div className="text-sm text-muted-foreground">Automatically transfer funds to bank</div>
                    </div>
                    <button
                      onClick={() => handleChange('auto_withdrawal', !payments.auto_withdrawal)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        payments.auto_withdrawal ? 'bg-success' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                          payments.auto_withdrawal ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">Payment Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive alerts for payments</div>
                    </div>
                    <button
                      onClick={() => handleChange('payment_notifications', !payments.payment_notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        payments.payment_notifications ? 'bg-success' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
                          payments.payment_notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Security & Verification</h3>
                  <p className="text-muted-foreground mb-3">
                    Your payment information is encrypted and securely stored. We verify all payment methods to ensure safe transactions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-foreground">256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-foreground">PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-foreground">Regular security audits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <span>✓</span>
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <span>✗</span>
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
