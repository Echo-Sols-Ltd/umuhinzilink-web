import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FarmProductCard, EnhancedFarmProduct } from '../FarmProductCard';
import { 
  RwandaCrop, 
  RwandaCropCategory, 
  ProductStatus, 
  MeasurementUnit, 
  CertificationType 
} from '@/types/enums';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the ProgressiveImage component
jest.mock('@/components/ui/progressive-loading', () => ({
  ProgressiveImage: ({ src, alt, className, onLoad }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onLoad={onLoad}
      data-testid="product-image"
    />
  ),
}));

const mockProduct: EnhancedFarmProduct = {
  id: '1',
  name: RwandaCrop.TOMATO,
  description: 'Fresh, juicy tomatoes grown using sustainable farming practices.',
  unitPrice: 800,
  originalPrice: 1000,
  image: 'https://example.com/tomato.jpg',
  quantity: 500,
  measurementUnit: MeasurementUnit.KG,
  category: RwandaCropCategory.VEGETABLES,
  harvestDate: new Date('2024-01-15'),
  location: 'Musanze District',
  isNegotiable: true,
  certification: CertificationType.RWANDA_GAP,
  productStatus: ProductStatus.IN_STOCK,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  farmer: {
    id: 'farmer-1',
    name: 'Jean Baptiste Uwimana',
    verified: true,
    rating: 4.8,
    totalSales: 150,
    responseTime: 2,
    profileImage: 'https://example.com/farmer.jpg',
    farmName: 'Green Valley Farm',
    experience: 8
  },
  freshness: 'fresh',
  organic: true,
  views: 245,
  inquiries: 12,
  trending: true,
  availableQuantity: 500,
  minimumOrder: 10,
  deliveryOptions: ['pickup', 'delivery'],
  estimatedDelivery: '1-2 days',
  lastUpdated: new Date('2024-01-15T10:00:00Z')
};

describe('FarmProductCard', () => {
  const mockOnContact = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnShare = jest.fn();
  const mockOnView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <FarmProductCard
        product={mockProduct}
        onContact={mockOnContact}
        onSave={mockOnSave}
        onShare={mockOnShare}
        onView={mockOnView}
      />
    );

    // Check product name
    expect(screen.getByText('TOMATO')).toBeInTheDocument();
    
    // Check location
    expect(screen.getByText('Musanze District')).toBeInTheDocument();
    
    // Check price
    expect(screen.getByText('800 RWF/kg')).toBeInTheDocument();
    
    // Check farmer name
    expect(screen.getByText('Jean Baptiste Uwimana')).toBeInTheDocument();
    
    // Check farm name
    expect(screen.getByText('Green Valley Farm')).toBeInTheDocument();
  });

  it('displays freshness badge correctly', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    expect(screen.getByText('Fresh')).toBeInTheDocument();
  });

  it('displays organic badge when product is organic', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    expect(screen.getByText('Organic')).toBeInTheDocument();
  });

  it('displays trending badge when product is trending', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('displays discount badge when there is a discount', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('displays certification badge', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    expect(screen.getByText('Rwanda GAP')).toBeInTheDocument();
  });

  it('displays farmer verification badge', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    // Check for verification checkmark (using test id or aria-label)
    const verificationIcon = screen.getByRole('img', { hidden: true });
    expect(verificationIcon).toBeInTheDocument();
  });

  it('displays farmer rating', () => {
    render(<FarmProductCard product={mockProduct} />);
    
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('calls onView when card is clicked', () => {
    render(
      <FarmProductCard
        product={mockProduct}
        onView={mockOnView}
      />
    );

    const card = screen.getByRole('button', { name: /view details/i }).closest('[role="button"]') || 
                 screen.getByText('TOMATO').closest('div');
    
    if (card) {
      fireEvent.click(card);
      expect(mockOnView).toHaveBeenCalledWith('1');
    }
  });

  it('calls onContact when contact button is clicked', () => {
    render(
      <FarmProductCard
        product={mockProduct}
        onContact={mockOnContact}
      />
    );

    const contactButton = screen.getByRole('button', { name: /contact/i });
    fireEvent.click(contactButton);
    
    expect(mockOnContact).toHaveBeenCalledWith('farmer-1');
  });

  it('calls onSave when save button is clicked', () =