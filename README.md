# UmuhinziLink-Fro

UmuhinziLink-Frontend

# 🌱 UmuhinziLink - Connect Farmers to Digital Markets

[![Live Demo](https://img.shields.io/badge/Live%20Demo-umuhinzilink.vercel.app-green?style=for-the-badge&logo=vercel)](https://umuhinzilink.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **Empowering smallholder farmers in Rwanda with Technology to access markets, get AI-powered farming advice and secure agricultural loans**

## 🚀 Live Application

🌐 **Visit the live application:** [umuhinzilink.vercel.app](https://agricommerce.vercel.app/)

## 📖 About UmuhinziLink

UmuhinziLink is Rwanda's first comprehensive digital agriculture platform, designed specifically for smallholder farmers. We combine cutting-edge technology with deep understanding of local farming practices to create sustainable solutions that bridge the gap between farmers and digital markets.

### 🎯 Mission

To empower Rwandan farmers through digital agriculture solutions, providing access to markets, AI-powered farming advice, and financial services.

## 🛠️ Technology Stack

### **Frontend**

- **Framework:** Next.js  (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **Fonts:** Geist Sans & Mono

### **Features**

- **Authentication:** localStorage-based demo system
- **State Management:** React hooks
- **Responsive Design:** Mobile-first approach
- **Theme Support:** Light/Dark mode with next-themes
- **Deployment:** Vercel (Serverless)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EchoSols/umuhinzilink-web.git
   cd umuhinzilink-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

```sh
app/
├── (auth)/
│   └── login/              # Authentication system
├── dashboard/              # Protected farmer dashboard
│   ├── products/          # My Products management
│   ├── credit/            # Input credit requests
│   ├── ai-tips/           # AI farming recommendations
│   ├── analytics/         # Market analytics
│   └── orders/            # Order management
├── components/
│   ├── ui/                # Reusable UI components
│   └── dashboard-sidebar.tsx
└── globals.css            # Global styles
```

## 🌟 Key Pages

### 🏠 **Landing Page**

- Hero section with agriculture imagery
- Feature showcase
- User type sections (Farmers, Suppliers, Buyers)
- Success stories from Nyagatare pilot
- Call-to-action sections

### 🚪 **Authentication**

- Phone number + password login
- Demo account access
- Secure session management
- Automatic dashboard redirect

### 📊 **Farmer Dashboard**

- Personalized welcome with user data
- Weather widget with local forecasts
- AI farming tips in Kinyarwanda
- Market price trends
- Recent orders tracking
- Quick stats overview

### 🌾 **Products Management**

- Visual product catalog
- Agriculture-specific imagery
- Price and quantity tracking
- Location-based listings
- Status management (Available/Sold)

### **Build Command**

```bash
npm run build
```

### **Backend Configuration**

The frontend is configured to connect to the Spring Boot backend API. To configure the connection:

1. **Create a `.env.local` file** in the root directory:

   ```bash
   # Backend API Configuration
   # For local development, use http://localhost:8080
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   API_BASE_URL=http://localhost:8080
   ```

2. **For production or remote backend**, update the values:

   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
   API_BASE_URL=https://your-backend-domain.com
   ```

3. **Backend Server Requirements:**
   - Backend should be running on port 8080 (default)
   - API endpoints should be available at `/api/v1/*`
   - CORS should be enabled for the frontend domain

**Note:** The frontend will automatically fallback to `http://localhost:8080` if no environment variables are set, making local development easier.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">

**Built with ❤️ for Rwandan farmers**

🌱 **UmuhinziLink** - _Connecting Farmers to Digital Markets_

[![GitHub](https://img.shields.io/badge/GitHub-EchoSols/FarmLink--Fro-black?style=flat&logo=github)](https://github.com/EchoSols/FarmLink-Fro)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-umuhinzilink.vercel.app-green?style=flat&logo=vercel)](https://umuhinzilink.vercel.app)

</div>
