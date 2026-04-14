# The Propertist 🏠

A modern, feature-rich real estate property listing platform built with Next.js 14, React, and Tailwind CSS. Browse properties, view detailed information with interactive galleries, and explore amenities and facilities with a beautiful, responsive interface.

## ✨ Features

### Homepage
- **Property Listings** - Browse all available properties in a responsive grid
- **Image Carousel** - Properties with multiple images feature a smooth, interactive carousel
  - Prev/Next navigation buttons
  - Dot indicators for quick navigation
  - Image counter (e.g., "2/5")
  - Auto-hidden scrollbar for clean UI
- **Search & Filters** - Find properties by location, price range, property type, and BHK
- **Property Cards** - Display price, location, BHK, and area with hover effects

### Property Details Page
- **Image Gallery** - Full-screen image gallery with:
  - Previous/Next navigation
  - Thumbnail strip for quick preview
  - Smooth transitions and captions
- **Property Information**
  - Title, location with map icon
  - Formatted pricing (Crore/Lakh conversion for Indian market)
  - Key stats grid (BHK, Area, Type)
- **Dynamic Navigation Tabs**
  - Sticky tab bar that auto-highlights based on scroll position
  - Smooth scroll-to-section functionality
  - Only shows relevant tabs based on available data
- **Content Sections**
  - About this property (single or multiple descriptions)
  - Top amenities grid with icons
  - Amenities & Facilities grouped by category
  - Property policies with detailed information
  - Check-in/Check-out information (when available)
- **Contact Card**
  - Agent/property contact information
  - Phone, email, and website links
  - Call-to-action buttons

### Responsive Design
- Mobile-first approach
- Fully responsive layout (mobile, tablet, desktop)
- Optimized images with Next.js Image component
- Smooth animations and transitions

## 🛠️ Tech Stack

- **Framework**: [Next.js 14.2.5](https://nextjs.org/) - React framework with App Router
- **UI Library**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS 3.3](https://tailwindcss.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Image Optimization**: Next.js Image component with automatic optimization
- **Data**: JSON-based property database

## 📋 Project Structure

```
the-propertist/
├── app/
│   ├── layout.tsx              # Root layout with header
│   ├── page.tsx                # Homepage with property listings
│   ├── globals.css             # Global styles
│   └── property/[id]/page.tsx  # Property detail page
├── components/
│   ├── PropertyCard.tsx        # Property listing card with carousel
│   ├── PropertyListing.tsx     # Grid layout for property cards
│   ├── ImageGallery.tsx        # Detail page image gallery
│   ├── TopFacilitiesGrid.tsx   # Top amenities grid
│   ├── FacilityGroupsList.tsx  # Grouped facilities/amenities
│   ├── PropertyPolicies.tsx    # Policy display component
│   ├── ContactCard.tsx         # Contact information display
│   ├── PropertyNavTabs.tsx     # Dynamic navigation tabs
│   ├── SearchBar.tsx           # Search functionality
│   ├── Filters.tsx             # Property filters
│   └── SkeletonCard.tsx        # Loading skeleton
├── types/
│   └── property.ts             # TypeScript interfaces
├── data/
│   └── properties.json         # Property database
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-propertist
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Create optimized production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking

## 📊 Data Structure

### Property Type
```typescript
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bhk: number;
  type: 'buy' | 'rent';
  area: number;
  description: string;
  image: string;
  amenities: string[];
  postedAt: string;
  
  // Optional rich fields
  images?: PropertyImage[];
  descriptions?: string[];
  topFacilities?: TopFacility[];
  facilityGroups?: FacilityGroup[];
  contact?: ContactInfo;
  policies?: Policy[];
  coordinates?: [string, string];
}
```

Properties are stored in `data/properties.json` and can include rich data for enhanced detail pages.

## 🎨 Styling

The application uses Tailwind CSS with a custom color scheme:
- **Primary**: Amber (`amber-500` for highlights)
- **Neutral**: Stone (gray scale for text and backgrounds)
- **Secondary**: Teal (for rent properties)

Key color usage:
- Amber: Buttons, highlights, active states, "For Sale" badges
- Teal: "For Rent" badges
- Stone: Text, borders, backgrounds

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for buttons and interactive elements
- Keyboard navigation support
- Focus states for interactive elements
- Alt text for all images
- Proper heading hierarchy

## 🔄 Key Components

### PropertyCard
- Displays individual property in listing
- Features image carousel for multiple images
- Shows prev/next buttons on hover
- Responsive design with hover effects

### ImageGallery
- Full-featured image gallery for detail pages
- Previous/Next navigation
- Thumbnail strip
- Caption support
- Smooth transitions

### PropertyNavTabs
- Client component for dynamic tab highlighting
- Tracks scroll position and highlights active section
- Smooth scroll-to-section on tab click
- Auto-adjusts for header height

### Filters & Search
- Filter properties by type (Buy/Rent)
- Search by location
- Filter by BHK (1, 2, 3, 4+)
- Filter by price range
- Real-time filtering

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (full-width, stacked layout)
- **Tablet**: 640px - 1024px (optimized touch targets)
- **Desktop**: > 1024px (multi-column layout)

## 🎯 Performance

- Static page generation for property detail pages
- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind for minimal CSS
- Component memoization to prevent unnecessary re-renders
- Lazy loading for images

## 🔐 Security

- Input validation and sanitization
- Safe URL handling
- No sensitive data in frontend
- Secure external links with `rel="noopener noreferrer"`

## 📝 Add New Properties

To add new properties, edit `data/properties.json` following the Property type structure. The homepage will automatically update with new listings.

Example:
```json
{
  "id": "new-property",
  "title": "Modern Apartment",
  "price": 5000000,
  "location": "Mumbai",
  "bhk": 2,
  "type": "buy",
  "area": 1200,
  "description": "Beautiful modern apartment...",
  "image": "https://example.com/image.jpg",
  "amenities": ["WiFi", "Parking"],
  "postedAt": "2024-04-14"
}
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Development Server Issues
```bash
# Kill any existing processes on port 3000
# Then restart the dev server
npm run dev
```

### Type Errors
```bash
# Run type checking
npm run type-check
```

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development

### Code Style
- TypeScript for type safety
- React functional components with hooks
- CSS-in-JS with Tailwind utilities
- Consistent naming conventions

### Component Guidelines
- Keep components small and focused
- Use TypeScript interfaces for props
- Separate client and server components
- Memoize components when appropriate

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Platforms
- Vercel (recommended for Next.js)
- AWS Amplify
- Netlify
- Docker containers

### Environment Variables
Currently uses only local data. For production, configure:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint (if applicable)
- `DATABASE_URL` - Database connection (if applicable)

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js 14**
