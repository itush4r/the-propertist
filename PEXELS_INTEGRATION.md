# Pexels API Integration Guide

## 📋 Overview

This project uses the **Pexels API** to fetch real, relevant property images for all listings. The integration includes:
- ✅ 400+ real estate images across 80 properties
- ✅ Smart categorization by property type (1BHK, 2BHK, villas, etc.)
- ✅ Caching to optimize performance
- ✅ Secure API key handling
- ✅ Fallback images for error handling

---

## 🔑 Setup & Configuration

### 1. API Key Setup

Your Pexels API key is stored in `.env.local`:

```bash
PEXELS_API_KEY=your_api_key_here
```

**⚠️ Important Security Notes:**
- ✅ `.env.local` is in `.gitignore` - never committed to Git
- ✅ API key is only used on the backend
- ✅ Frontend only calls the proxy endpoint `/api/getPropertyImage`
- ✅ No sensitive data exposed to browser

### 2. Get Your API Key

If you need a new API key:
1. Visit https://www.pexels.com/api/
2. Sign up (free account)
3. Generate an API key
4. Add to `.env.local`

---

## 🏗️ Architecture

### Backend API Endpoint

**Route:** `/api/getPropertyImage`

**Location:** `app/api/getPropertyImage/route.ts`

**Purpose:** Proxy requests to Pexels API without exposing the API key

**Query Parameters:**
```
GET /api/getPropertyImage?bhk=2&type=buy&roomType=living-room
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `bhk` | number | 1, 2, 3, or 4+ |
| `type` | string | "buy" or "rent" |
| `roomType` | string | "main", "gallery", etc. |

**Response:**
```json
{
  "url": "https://images.pexels.com/photos/..."
}
```

**Features:**
- Smart query mapping based on property type
- 24-hour caching headers
- Fallback image on API errors
- Error handling with graceful degradation

### Data Population Script

**Location:** `scripts/fetchPexelsImages.js`

**Purpose:** One-time script to populate all 400 property images

**Features:**
- Batch fetches images from Pexels
- In-memory caching to avoid duplicate API calls
- Rate limiting (300ms between requests)
- Progress tracking
- Categorized search queries for relevance

**Run:**
```bash
node scripts/fetchPexelsImages.js
```

### Image Cache Utility

**Location:** `lib/imageCache.ts`

**Purpose:** Client-side caching in localStorage

**Functions:**
```typescript
getCachedImage(key: string): string | null
setCachedImage(key: string, url: string): void
clearImageCache(): void
getCacheStats(): CacheStats
```

**Cache Configuration:**
- Expiry: 7 days
- Version: 1 (for cache invalidation)
- Storage: localStorage

---

## 🔄 How It Works

### Data Flow

```
Properties Dataset (80 properties)
         ↓
Pexels API Fetcher Script
         ↓
Fetch real images by category
         ↓
Cache results in properties.json
         ↓
Frontend displays cached images
         ↓
(Optional) Backend /api/getPropertyImage for dynamic fetching
```

### Image Categorization

The system intelligently maps properties to images:

| Property Type | Search Query |
|---------------|--------------|
| 1 BHK | "studio apartment interior" |
| 2 BHK | "modern 2bhk apartment" |
| 3 BHK | "luxury 3bhk apartment" |
| 4+ BHK | "luxury villa interior design" |

**Room Types:**
- Living Room → "modern apartment living room"
- Master Bedroom → "luxury master bedroom"
- Kitchen → "modern kitchen interior"
- Balcony → "apartment balcony"
- Bathroom → "modern bathroom interior"
- Pool → "swimming pool apartment"

---

## 📊 Data Structure

Each property in `data/properties.json` now includes:

```json
{
  "id": "1",
  "title": "Luxury 1 BHK Sea-View Apartment",
  "image": "https://images.pexels.com/photos/...",
  "images": [
    {
      "url": "https://images.pexels.com/photos/...",
      "caption": "Living Room"
    },
    ...
  ]
}
```

**Total Images:** 400 (80 properties × 5 images each)

---

## ⚡ Performance Optimizations

### 1. Server-Side Caching
- 24-hour cache headers on API responses
- Prevents repeated requests for same images

### 2. Client-Side Caching
- localStorage caching (7-day expiry)
- Reduces API calls during development

### 3. Rate Limiting
- 300ms between API requests
- Prevents rate limit errors
- Can be adjusted in `scripts/fetchPexelsImages.js`

### 4. Fallback Images
- Default image served if API fails
- No broken images displayed
- Graceful error handling

---

## 🛡️ Security

### API Key Protection
✅ **Secure:**
- Stored in `.env.local` (not committed)
- Only used on backend
- Never exposed to frontend

❌ **Insecure:**
- Storing in frontend code
- Committing to repository
- Exposing in network requests

### Frontend Safety
- All Pexels requests go through `/api/getPropertyImage` endpoint
- Backend handles authentication
- Browser never sees raw API key

---

## 🚀 Future Enhancements

### Optional Improvements

1. **Dynamic Image Updates**
   - Periodically refresh images with new Pexels photos
   - Scheduled cron job

2. **Image Optimization**
   - Lazy loading for gallery images
   - Responsive image sizes
   - WebP format conversion

3. **Multiple Image Sources**
   - Fallback to Unsplash if Pexels fails
   - Custom image uploads per property

4. **Analytics**
   - Track which images are viewed most
   - Optimize search queries based on performance

5. **Category-Specific Images**
   - Add room type detection
   - Fetch bathroom/kitchen/bedroom images separately

---

## 📝 Maintenance

### Updating Images

To refresh all images:

```bash
node scripts/fetchPexelsImages.js
```

### Checking Cache

View cache statistics:

```typescript
import { getCacheStats } from '@/lib/imageCache';
console.log(getCacheStats());
```

### Clearing Cache

```typescript
import { clearImageCache } from '@/lib/imageCache';
clearImageCache();
```

---

## ⚠️ Troubleshooting

### Issue: "API key not configured"
**Solution:** Add API key to `.env.local`
```bash
PEXELS_API_KEY=your_key_here
```

### Issue: "Too many requests"
**Solution:** Increase delay in `scripts/fetchPexelsImages.js`
```javascript
await new Promise(resolve => setTimeout(resolve, 500)); // 500ms instead of 300ms
```

### Issue: Images not loading
**Solution:**
1. Check browser console for errors
2. Verify `.env.local` has valid API key
3. Run build: `npm run build`
4. Clear browser cache (Ctrl+Shift+Del)

### Issue: Cache not working
**Solution:** Clear localStorage
```javascript
localStorage.clear();
```

---

## 📚 References

- [Pexels API Docs](https://www.pexels.com/api/)
- [Pexels API v1](https://www.pexels.com/api/documentation/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

---

## ✅ Checklist

- [x] API key stored in `.env.local`
- [x] `.env.local` in `.gitignore`
- [x] Backend endpoint created (`/api/getPropertyImage`)
- [x] 400 images fetched and cached
- [x] All properties display relevant images
- [x] Fallback images configured
- [x] Caching implemented
- [x] Rate limiting enabled
- [x] Error handling in place
- [x] No API key exposed
- [x] Build completes successfully

---

**Last Updated:** April 2026
**Status:** ✅ Production Ready
