# The Propertist 🏠

A modern, feature-rich real estate property listing platform built with **Next.js 16**, **React 18**, and **Tailwind CSS**. Browse properties, view detailed information with interactive galleries, schedule tours, and save favorite properties with a beautiful, responsive interface.

## ✨ Features

### Homepage
- **Property Listings** - Browse 80+ properties in a responsive grid layout
- **Smart Image Carousel** - Interactive carousel with auto-scroll (5-second intervals)
  - Prev/Next navigation buttons
  - Dot indicators for quick navigation
  - Image counter (e.g., "1/4")
  - **Auto-hides next image** on hover (fixed overflow)
- **Real Estate Images** - 400+ unique property images from **Pexels API**
- **Quick Save** - Click heart icon to save properties to session storage
- **Share Button** - Copy property link to clipboard with visual feedback
- **Property Cards** - Display price, location, BHK, and area with smooth hover effects

### Property Details Page
- **High-Quality Image Gallery** - Crystal clear images (quality 95)
  - Previous/Next navigation
  - Thumbnail strip with captions
  - **Auto-scrolling** (5-second intervals)
  - Smooth transitions
  - Caption overlay
- **Property Information**
  - Title, location with map icon
  - Formatted pricing (Crore/Lakh conversion for Indian market)
  - Key stats grid (BHK, Area, Type)
- **Smart Navigation Tabs**
  - Sticky tab bar with scroll-detection
  - **Auto-highlights** when reaching bottom (policies)
  - Smooth scroll-to-section with proper offset
  - Only shows relevant tabs based on data
- **Interactive Sections**
  - About this property (with multiple descriptions)
  - Top amenities grid with icons
  - Amenities & Facilities grouped by category
  - Property policies with details
- **Contact Sidebar**
  - Verified partner badge
  - Agent contact information
  - **"Schedule a Tour"** modal with form
  - **Save property** functionality (session storage)
  - **Share property** with copy-to-clipboard
  - Call/Email/Website links

### Tour Scheduling Modal
- **Form Fields**
  - Full Name
  - Email Address with **real-time validation**
  - Phone Number
  - Preferred Date & Time
- **Email Validation**
  - Real-time validation as user types
  - Red border on invalid email
  - Error message with validation icon
  - Submit button disabled if email invalid
  - Valid format: `user@example.com`
- **Success Notification**
  - Green success toast after submission
  - Auto-closes after 2 seconds
  - Confirmation message

### Save & Share Functionality
- **Save Properties**
  - Click heart icon to save/unsave
  - Filled red heart when saved
  - Text changes: "SAVE" → "SAVED"
  - Persists in session storage
  - Shows as saved on page return (same session)
- **Share Properties**
  - Click share icon to copy property link
  - Text changes: "SHARE" → "COPIED!" (green)
  - Auto-reverts to "SHARE" after 2 seconds
  - Uses Web Share API when available
  - Falls back to clipboard API

### Image Optimization
- **Pexels API Integration** - Real estate quality images
- **Format Support** - WebP, AVIF with PNG fallback
- **Quality Levels** - [70, 75, 85, 90, 95] for responsive optimization
- **Smart Caching** - 1-year cache TTL for performance
- **Device Optimization** - Responsive image sizes

### Responsive Design
- Mobile-first approach
- Fully responsive (mobile, tablet, desktop)
- Touch-optimized buttons and interactions
- Smooth animations and transitions

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.2.3](https://nextjs.org/) - React framework with App Router & Turbopack
- **UI Library**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS 3.3](https://tailwindcss.com/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Image Source**: [Pexels API](https://www.pexels.com/api/) - 400+ real estate images
- **Image Optimization**: Next.js Image component with format conversion
- **Storage**: SessionStorage for saved properties
- **Data**: JSON-based property database with 80 properties

## 📋 Project Structure

```
the-propertist/
├── app/
│   ├── layout.tsx                    # Root layout with header
│   ├── page.tsx                      # Homepage with listings
│   ├── globals.css                   # Global styles
│   ├── api/
│   │   └── getPropertyImage/route.ts # Pexels API proxy endpoint
│   └── property/[id]/page.tsx        # Property detail page
├── components/
│   ├── PropertyCard.tsx              # Listing card with carousel
│   ├── PropertyListing.tsx           # Grid layout
│   ├── ImageGallery.tsx              # Detail page gallery with auto-scroll
│   ├── SinglePropertyImage.tsx       # Single image display
│   ├── TopFacilitiesGrid.tsx         # Amenities grid
│   ├── FacilityGroupsList.tsx        # Grouped facilities
│   ├── PropertyPolicies.tsx          # Policy display
│   ├── ContactCard.tsx               # Contact info
│   ├── PropertyNavTabs.tsx           # Dynamic nav tabs with scroll detection
│   ├── PropertyDetailsSidebar.tsx    # Sidebar with save/share/modal
│   ├── ScheduleTourModal.tsx         # Tour scheduling form
│   ├── SuccessToast.tsx              # Success notification
│   ├── SearchBar.tsx                 # Search functionality
│   ├── Filters.tsx                   # Property filters
│   └── SkeletonCard.tsx              # Loading skeleton
├── lib/
│   └── imageCache.ts                 # Client-side image caching utility
├── types/
│   └── property.ts                   # TypeScript interfaces
├── data/
│   └── properties.json               # 80 properties with Pexels images
├── scripts/
│   ├── fetchPexelsImages.js          # Initial image fetch script
│   ├── fetchUniqueImages.js          # Unique image fetching
│   └── fetchMaxUniqueImages.js       # Max unique image fetching
├── public/                            # Static assets
├── .env.local                        # Pexels API key (not in git)
├── .env.local.example                # Environment template
├── next.config.js                    # Next.js config with image optimization
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm
- Pexels API key (optional, for fresh image fetching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-propertist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment (optional)**
   ```bash
   cp .env.local.example .env.local
   # Add your Pexels API key to .env.local
   # PEXELS_API_KEY=your_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Create optimized production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Run TypeScript type checking
- `node scripts/fetchPexelsImages.js` - Refresh all property images from Pexels

## 🔑 Environment Variables

### `.env.local` (Create this file)
```
PEXELS_API_KEY=your_pexels_api_key_here
```

**Note**: `.env.local` is in `.gitignore` for security

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
  images: PropertyImage[];
  descriptions: string[];
  amenities: string[];
  topFacilities: TopFacility[];
  facilityGroups: FacilityGroup[];
  contact: ContactInfo;
  policies: Policy[];
}

interface PropertyImage {
  url: string;
  caption: string;
}
```

## 🎨 Color Scheme

- **Primary**: Amber (`amber-500`) - Buttons, highlights, active states
- **Accent**: Red (`red-600`) - Saved state, heart icon filled
- **Success**: Green (`green-600`) - Success notifications
- **Neutral**: Stone (gray scale) - Text, borders, backgrounds

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Alt text for all images
- Proper heading hierarchy
- Form validation with error messages

## 🔄 Key Features Explained

### Auto-Scroll Gallery
- Slides to next image every 5 seconds
- Pauses on manual navigation
- Works on both homepage cards and detail page

### Image Quality
- Uses Pexels API for real property images
- Quality set to 95 for crystal clear display
- `object-contain` to preserve aspect ratio
- No blurry or stretched images

### Save Functionality
- Uses `sessionStorage` for persistence
- Key: `saved_properties` (array of property IDs)
- Persists throughout browser session
- Clears when browser closes

### Share Functionality
- Copies property URL to clipboard
- Visual feedback: "SHARE" → "COPIED!" → "SHARE"
- Uses Web Share API when available
- Fallback to clipboard API

### Email Validation
- Real-time validation as user types
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Form cannot submit with invalid email
- Clear error messages

### Navigation Scroll Detection
- Highlights active section as user scrolls
- Automatically highlights "Policies" at bottom
- Smooth scroll-to-section on tab click
- Proper offset accounting for sticky headers

## 🐛 Troubleshooting

### Images Not Loading
- Check Pexels API key in `.env.local`
- Verify image URLs are valid
- Clear browser cache and rebuild

### Tour Modal Not Opening
- Ensure JavaScript is enabled
- Check browser console for errors
- Clear localStorage/sessionStorage

### Email Validation Not Working
- Check browser supports HTML5 email input
- Verify JavaScript is enabled
- Check console for validation errors

## 📈 Performance

- Static page generation (ISR)
- Image optimization with Next.js
- Component memoization
- Session storage for quick saves
- API response caching (24 hours)
- Lazy loading for images

## 🔐 Security

- No API keys exposed in frontend
- `.env.local` excluded from git
- Input validation on all forms
- Safe external links with proper rel attributes
- Session-based storage (no sensitive data)

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Version**: 2.0.0 | **Last Updated**: April 2026

**Built with ❤️ using Next.js 16, Pexels API & Tailwind CSS**
