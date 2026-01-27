import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FarmerProfileCard } from '../FarmerProfileCard';
import { 
  Farmer, 
  User, 
  Address, 
  Province, 
  District, 
  FarmSizeCategory, 
  ExperienceLevel, 
  RwandaCrop,
  UserType,
  Language
} from '@/types';

// Mock farmer data
const mockUser: User = {
  id: '1',
  names: 'Test Farmer',
  email: 'test@example.com',
  phoneNumber: '+250788123456',
  address: {
    province: Province.NORTHERN,
    district: District.MUSANZE
  } as Address,
  avatar: '/test-avatar.jpg',
  createdAt: '2022-01-01T00:00:00Z',
  lastLogin: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  verified: true,
  password: '',
  role: UserType.FARMER,
  language: Language.ENGLISH
};

const mockFarmer: Farmer & {
  rating: number;
  totalSales: number;
  completedOrders: number;
  responseTime: number;
  verified: boolean;
} = {
  id: '1',
  user: mockUser,
  crops: [RwandaCrop.TOMATO, RwandaCrop.CABBAGE],
  farmSize: FarmSizeCategory.MEDIUM,
  experienceLevel: ExperienceLevel.Y5_TO_10,
  rating: 4.5,
  totalSales: 1000000,
  completedOrders: 50,
  responseTime: 2,
  verified: true
};

describe('FarmerProfileCard', () => {
  it('renders farmer name and basic information', () => {
    render(<FarmerProfileCard farmer={mockFarmer} />);
    
    expect(screen.getByText('Test Farmer')).toBeInTheDocument();
    expect(screen.getByText('MUSANZE, NORTHERN')).toBeInTheDocument();
  });

  it('displays rating correctly', () => {
    render(<FarmerProfileCard farmer={mockFarmer} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('shows verification badge when farmer is verified', () => {
    render(<FarmerProfileCard farmer={mockFarmer} />);
    
    // Check for verified status (icon should be present)
    const verifiedIcon = document.querySelector('[data-testid="verified-icon"]');
    // Since we're using Lucide icons, we'll check for the presence of the verification indicator
    expect(screen.getByText('Verified Farmer')).toBeInTheDocument();
  });

  it('displays farm size and experience level', () => {
    render(<FarmerProfileCard farmer={mockFarmer} />);
    
    expect(screen.getByText('Medium Scale')).toBeInTheDocument();
    expect(screen.getByText('5-10 years')).toBeInTheDocument();
  });

  it('shows primary crops as badges', () => {
    render(<FarmerProfileCard farmer={mockFarmer} />);
    
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Cabbage')).toBeInTheDocument();
  });

  it('calls onContact when contact button is clicked', () => {
    const mockOnContact = jest.fn();
    render(<FarmerProfileCard farmer={mockFarmer} onContact={mockOnContact} />);
    
    const contactButton = screen.getByText('Contact');
    fireEvent.click(contactButton);
    
    expect(mockOnContact).toHaveBeenCalledTimes(1);
  });

  it('calls onViewProfile when view profile button is clicked', () => {
    const mockOnViewProfile = jest.fn();
    render(
      <FarmerProfileCard 
        farmer={mockFarmer} 
        variant="detailed"
        onViewProfile={mockOnViewProfile} 
      />
    );
    
    const viewProfileButton = screen.getByText('View Full Profile');
    fireEvent.click(viewProfileButton);
    
    expect(mockOnViewProfile).toHaveBeenCalledTimes(1);
  });

  it('renders compact variant correctly', () => {
    render(<FarmerProfileCard farmer={mockFarmer} variant="compact" />);
    
    expect(screen.getByText('Test Farmer')).toBeInTheDocument();
    expect(screen.getByText('50 orders')).toBeInTheDocument();
  });

  it('shows contact information when showContactInfo is true', () => {
    render(
      <FarmerProfileCard 
        farmer={{
          ...mockFarmer,
          phoneNumber: '+250788123456',
          email: 'test@example.com'
        }} 
        showContactInfo={true} 
      />
    );
    
    expect(screen.getByText('+250788123456')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays performance metrics correctly', () => {
    render(<FarmerProfileCard farmer={mockFarmer} />);
    
    expect(screen.getByText('1,000,000 RWF')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('2h')).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const minimalFarmer = {
      ...mockFarmer,
      rating: undefined,
      totalSales: undefined,
      completedOrders: undefined,
      responseTime: undefined
    };

    render(<FarmerProfileCard farmer={minimalFarmer} />);
    
    expect(screen.getByText('Test Farmer')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });
});