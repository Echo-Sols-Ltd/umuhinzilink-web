import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  TouchButton,
  ThumbReachLayout,
  ProgressiveContent,
  OfflineCapability,
  MobileNavigation,
  ExpandableContent,
  MobileCard,
  SwipeHandler,
  ResponsiveGrid
} from '../mobile-first-patterns';

// Mock hooks
jest.mock('@/hooks/use-mobile', () => ({
  useIsMobile: jest.fn(() => true),
}));

jest.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: jest.fn(() => ({
    isOnline: true,
    isSlowConnection: false,
  })),
}));

describe('Mobile-First Patterns', () => {
  describe('TouchButton', () => {
    it('renders with minimum touch target size', () => {
      render(<TouchButton>Test Button</TouchButton>);
      const button = screen.getByRole('button');
      
      // Check if button has minimum height class
      expect(button).toHaveClass('min-h-[48px]');
    });

    it('handles different sizes correctly', () => {
      const { rerender } = render(<TouchButton size="sm">Small</TouchButton>);
      expect(screen.getByRole('button')).toHaveClass('min-h-[44px]');

      rerender(<TouchButton size="lg">Large</TouchButton>);
      expect(screen.getByRole('button')).toHaveClass('min-h-[52px]');

      rerender(<TouchButton size="xl">Extra Large</TouchButton>);
      expect(screen.getByRole('button')).toHaveClass('min-h-[56px]');
    });

    it('applies touch-friendly styles', () => {
      render(<TouchButton>Touch Button</TouchButton>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveClass('touch-manipulation');
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<TouchButton onClick={handleClick}>Click Me</TouchButton>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
      render(<TouchButton loading>Loading Button</TouchButton>);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('supports full width variant', () => {
      render(<TouchButton fullWidth>Full Width</TouchButton>);
      
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('ThumbReachLayout', () => {
    it('renders children in thumb-friendly zones on mobile', () => {
      render(
        <ThumbReachLayout>
          <div data-testid="header">Header</div>
          <div data-testid="content">Content</div>
          <div data-testid="actions">Actions</div>
        </ThumbReachLayout>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('actions')).toBeInTheDocument();
    });
  });

  describe('ProgressiveContent', () => {
    it('shows fallback initially then loads content', async () => {
      const fallback = <div data-testid="fallback">Loading...</div>;
      const content = <div data-testid="content">Loaded Content</div>;

      render(
        <ProgressiveContent fallback={fallback} priority="high">
          {content}
        </ProgressiveContent>
      );

      // Should show fallback initially
      expect(screen.getByTestId('fallback')).toBeInTheDocument();

      // Should load content after delay
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('respects priority levels', async () => {
      const { rerender } = render(
        <ProgressiveContent priority="high">
          <div data-testid="high-priority">High Priority</div>
        </ProgressiveContent>
      );

      // High priority should load quickly
      await waitFor(() => {
        expect(screen.getByTestId('high-priority')).toBeInTheDocument();
      }, { timeout: 100 });

      rerender(
        <ProgressiveContent priority="low">
          <div data-testid="low-priority">Low Priority</div>
        </ProgressiveContent>
      );

      // Low priority should take longer
      expect(screen.queryByTestId('low-priority')).not.toBeInTheDocument();
    });
  });

  describe('OfflineCapability', () => {
    it('shows offline message when offline', () => {
      const { useNetworkStatus } = require('@/hooks/useNetworkStatus');
      useNetworkStatus.mockReturnValue({
        isOnline: false,
        isSlowConnection: false,
      });

      render(
        <OfflineCapability offlineMessage="Custom offline message">
          <div data-testid="content">Content</div>
        </OfflineCapability>
      );

      expect(screen.getByText('Custom offline message')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toHaveClass('opacity-50');
    });

    it('shows slow connection warning', () => {
      const { useNetworkStatus } = require('@/hooks/useNetworkStatus');
      useNetworkStatus.mockReturnValue({
        isOnline: true,
        isSlowConnection: true,
      });

      render(
        <OfflineCapability>
          <div data-testid="content">Content</div>
        </OfflineCapability>
      );

      expect(screen.getByText(/slow connection/i)).toBeInTheDocument();
    });
  });

  describe('MobileNavigation', () => {
    const navigationItems = [
      { label: 'Home', href: '/home', icon: <span>🏠</span> },
      { label: 'Profile', href: '/profile', icon: <span>👤</span>, badge: '3' },
    ];

    it('renders navigation items on mobile', () => {
      render(<MobileNavigation items={navigationItems} />);
      
      // Should show menu button on mobile
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('opens mobile menu when button is clicked', () => {
      render(<MobileNavigation items={navigationItems} />);
      
      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      expect(screen.getByText('Menu')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('shows badges on navigation items', () => {
      render(<MobileNavigation items={navigationItems} />);
      
      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('ExpandableContent', () => {
    it('toggles content visibility', () => {
      render(
        <ExpandableContent title="Test Title">
          <div data-testid="content">Expandable Content</div>
        </ExpandableContent>
      );

      // Content should be hidden initially
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      // Click to expand
      fireEvent.click(screen.getByText('Test Title'));
      expect(screen.getByTestId('content')).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(screen.getByText('Test Title'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('can be expanded by default', () => {
      render(
        <ExpandableContent title="Test Title" defaultExpanded>
          <div data-testid="content">Expandable Content</div>
        </ExpandableContent>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('MobileCard', () => {
    it('renders with proper mobile styling', () => {
      render(
        <MobileCard data-testid="card">
          <div>Card Content</div>
        </MobileCard>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'rounded-organic');
    });

    it('applies different padding sizes', () => {
      const { rerender } = render(
        <MobileCard padding="sm" data-testid="card">
          Content
        </MobileCard>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-3');

      rerender(
        <MobileCard padding="lg" data-testid="card">
          Content
        </MobileCard>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-6');
    });

    it('applies shadow and border when specified', () => {
      render(
        <MobileCard shadow border data-testid="card">
          Content
        </MobileCard>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-green-sm', 'border');
    });
  });

  describe('SwipeHandler', () => {
    it('handles swipe gestures', () => {
      const onSwipeLeft = jest.fn();
      const onSwipeRight = jest.fn();

      render(
        <SwipeHandler 
          onSwipeLeft={onSwipeLeft} 
          onSwipeRight={onSwipeRight}
          data-testid="swipe-area"
        >
          <div>Swipeable Content</div>
        </SwipeHandler>
      );

      const swipeArea = screen.getByTestId('swipe-area');

      // Simulate swipe left
      fireEvent.touchStart(swipeArea, {
        targetTouches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchMove(swipeArea, {
        targetTouches: [{ clientX: 50, clientY: 100 }],
      });
      fireEvent.touchEnd(swipeArea);

      expect(onSwipeLeft).toHaveBeenCalledTimes(1);

      // Simulate swipe right
      fireEvent.touchStart(swipeArea, {
        targetTouches: [{ clientX: 50, clientY: 100 }],
      });
      fireEvent.touchMove(swipeArea, {
        targetTouches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchEnd(swipeArea);

      expect(onSwipeRight).toHaveBeenCalledTimes(1);
    });
  });

  describe('ResponsiveGrid', () => {
    it('applies correct grid classes', () => {
      render(
        <ResponsiveGrid 
          cols={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="md"
          data-testid="grid"
        >
          <div>Item 1</div>
          <div>Item 2</div>
        </ResponsiveGrid>
      );

      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'gap-4');
    });

    it('handles different gap sizes', () => {
      const { rerender } = render(
        <ResponsiveGrid gap="sm" data-testid="grid">
          <div>Item</div>
        </ResponsiveGrid>
      );
      expect(screen.getByTestId('grid')).toHaveClass('gap-2');

      rerender(
        <ResponsiveGrid gap="lg" data-testid="grid">
          <div>Item</div>
        </ResponsiveGrid>
      );
      expect(screen.getByTestId('grid')).toHaveClass('gap-6');
    });
  });
});

// Test mobile-specific behaviors
describe('Mobile-Specific Behaviors', () => {
  beforeEach(() => {
    // Mock mobile environment
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone width
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 767px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('applies touch-friendly minimum sizes', () => {
    render(<TouchButton>Mobile Button</TouchButton>);
    const button = screen.getByRole('button');
    
    // Should have minimum 48px height for touch accessibility
    expect(button).toHaveClass('min-h-[48px]');
  });

  it('optimizes for thumb reach zones', () => {
    render(
      <ThumbReachLayout>
        <div data-testid="header">Header</div>
        <div data-testid="content">Content</div>
        <div data-testid="actions">Actions</div>
      </ThumbReachLayout>
    );

    // Layout should be optimized for mobile
    const layout = screen.getByTestId('header').parentElement?.parentElement;
    expect(layout).toHaveClass('min-h-screen');
  });

  it('handles progressive loading based on network conditions', async () => {
    const { useNetworkStatus } = require('@/hooks/useNetworkStatus');
    useNetworkStatus.mockReturnValue({
      isOnline: true,
      isSlowConnection: true,
    });

    render(
      <ProgressiveContent priority="medium">
        <div data-testid="content">Content</div>
      </ProgressiveContent>
    );

    // Should delay loading on slow connections
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument();
    }, { timeout: 400 });
  });
});

// Accessibility tests
describe('Mobile Accessibility', () => {
  it('provides adequate touch targets', () => {
    render(<TouchButton>Accessible Button</TouchButton>);
    const button = screen.getByRole('button');
    
    // Should meet WCAG touch target guidelines (44px minimum)
    expect(button).toHaveClass('min-h-[48px]');
  });

  it('supports keyboard navigation', () => {
    render(
      <ExpandableContent title="Keyboard Accessible">
        <div>Content</div>
      </ExpandableContent>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('provides proper focus indicators', () => {
    render(<TouchButton>Focus Test</TouchButton>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('supports screen readers with proper labels', () => {
    const navigationItems = [
      { label: 'Home', href: '/home', icon: <span>🏠</span> },
    ];

    render(<MobileNavigation items={navigationItems} />);
    
    // Menu button should be accessible
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });
});