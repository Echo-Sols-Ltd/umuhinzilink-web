import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherWidget, type WeatherData } from '../WeatherWidget';

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 data-testid="card-title">{children}</h3>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} {...props} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, style }: any) => (
    <span data-testid="badge" data-variant={variant} style={style}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: any) => <div data-testid="progress" data-value={value} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: () => <div data-testid="select-value" />,
}));

const mockCurrentWeather: WeatherData = {
  date: '2024-01-15T10:00:00Z',
  temperature: {
    current: 24,
    high: 28,
    low: 18,
    feelsLike: 26,
  },
  humidity: 65,
  rainfall: 12,
  windSpeed: 8,
  windDirection: 'NE',
  visibility: 10,
  uvIndex: 6,
  pressure: 1013,
  condition: 'cloudy',
  description: 'Partly cloudy with light rain',
};

const mockForecast: WeatherData[] = [
  {
    date: '2024-01-16T10:00:00Z',
    temperature: { current: 26, high: 30, low: 20, feelsLike: 28 },
    humidity: 58, rainfall: 5, windSpeed: 12, windDirection: 'E',
    visibility: 12, uvIndex: 7, pressure: 1015, condition: 'sunny',
    description: 'Sunny with light breeze',
  },
  {
    date: '2024-01-17T10:00:00Z',
    temperature: { current: 22, high: 25, low: 16, feelsLike: 24 },
    humidity: 75, rainfall: 25, windSpeed: 15, windDirection: 'SW',
    visibility: 8, uvIndex: 4, pressure: 1008, condition: 'rainy',
    description: 'Heavy rain expected',
  },
];

describe('WeatherWidget', () => {
  it('renders weather widget with current weather data', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
      />
    );
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Weather & Agricultural Timing');
    expect(screen.getByText('Kigali, Rwanda')).toBeInTheDocument();
  });

  it('displays current temperature correctly', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
      />
    );
    
    expect(screen.getByText('24°C')).toBeInTheDocument();
    expect(screen.getByText('Partly cloudy with light rain')).toBeInTheDocument();
    expect(screen.getByText('Feels like 26°C')).toBeInTheDocument();
  });

  it('shows detailed weather metrics when enabled', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
        showDetailedMetrics={true}
      />
    );
    
    expect(screen.getByText('65%')).toBeInTheDocument(); // Humidity
    expect(screen.getByText('12mm')).toBeInTheDocument(); // Rainfall
    expect(screen.getByText('8 km/h')).toBeInTheDocument(); // Wind speed
    expect(screen.getByText('6')).toBeInTheDocument(); // UV index
  });

  it('generates agricultural timing recommendations', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
        showAgriculturalTiming={true}
      />
    );
    
    // Switch to timing view to see recommendations
    const timingButton = screen.getAllByTestId('select-item').find(item => 
      item.getAttribute('data-value') === 'timing'
    );
    
    if (timingButton) {
      fireEvent.click(timingButton);
    }
    
    // Should show agricultural timing recommendations
    expect(screen.getByText('Agricultural Timing Recommendations')).toBeInTheDocument();
  });

  it('shows weather alerts when conditions warrant them', () => {
    const extremeWeather: WeatherData = {
      ...mockCurrentWeather,
      temperature: { ...mockCurrentWeather.temperature, high: 40, low: 2 },
      rainfall: 60,
      windSpeed: 30,
    };
    
    render(
      <WeatherWidget
        currentWeather={extremeWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
        showAlerts={true}
      />
    );
    
    expect(screen.getByText('Weather Alerts')).toBeInTheDocument();
  });

  it('handles forecast view mode', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
      />
    );
    
    // Should show forecast buttons
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('calculates UV index levels correctly', () => {
    const highUVWeather: WeatherData = {
      ...mockCurrentWeather,
      uvIndex: 9,
    };
    
    render(
      <WeatherWidget
        currentWeather={highUVWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
        showDetailedMetrics={true}
      />
    );
    
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('applies agricultural styling classes', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
      />
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('agricultural-card');
  });

  it('handles view mode switching', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
      />
    );
    
    // Should have view mode selector
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('provides agricultural insights based on weather conditions', () => {
    render(
      <WeatherWidget
        currentWeather={mockCurrentWeather}
        forecast={mockForecast}
        location="Kigali, Rwanda"
        showAgriculturalTiming={true}
      />
    );
    
    // Switch to timing view
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    
    // Should show growing conditions and field work conditions
    expect(screen.getByText('Growing Conditions')).toBeInTheDocument();
    expect(screen.getByText('Field Work Conditions')).toBeInTheDocument();
  });
});