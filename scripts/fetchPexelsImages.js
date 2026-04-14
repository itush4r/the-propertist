const fs = require('fs');
const path = require('path');

const PEXELS_API_KEY = 'zhoZyoXvGzeLeAfQHsycBXLfvMutZiGNLsiLkj1TdpE71ThwwSgocCgD';

// Map BHK and room types to Pexels search queries
const queryMap = {
  'Living Room': ['modern apartment living room', 'contemporary living space'],
  'Master Bedroom': ['luxury master bedroom', 'modern bedroom interior'],
  'Modern Kitchen': ['modern kitchen interior', 'luxury kitchen design'],
  'Outdoor Space': ['apartment balcony', 'modern patio design'],
  'Dining Area': ['modern dining room', 'apartment dining space'],
  'Balcony': ['apartment balcony view', 'modern balcony design'],
  'Bathroom': ['modern bathroom interior', 'luxury bathroom design'],
  'Entrance': ['modern apartment entrance', 'luxury foyer'],
  'Pool Area': ['swimming pool apartment', 'luxury pool design'],
  'Gym': ['apartment gym', 'fitness center'],
};

// Cache to avoid duplicate API calls for same queries
const imageCache = {};

// Fetch image from Pexels API
async function fetchPexelsImage(query) {
  // Check cache first
  if (imageCache[query]) {
    console.log(`  📦 Using cached image for: "${query}"`);
    return imageCache[query];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.large;
      imageCache[query] = imageUrl;
      console.log(`  ✓ Fetched: "${query}"`);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.error(`  ❌ Error fetching "${query}":`, error.message);
    return null;
  }
}

// Get search query for a caption
function getQueryForCaption(caption) {
  for (const [key, queries] of Object.entries(queryMap)) {
    if (caption.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(caption.toLowerCase())) {
      return queries[0];
    }
  }
  return 'modern apartment interior';
}

// Main function
async function populateImages() {
  const dataPath = path.join(__dirname, '../data/properties.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('🚀 Starting Pexels API integration...\n');
  console.log(`📊 Processing ${data.length} properties\n`);

  let updated = 0;
  let mainImagesUpdated = 0;
  let galleryImagesUpdated = 0;

  for (let i = 0; i < data.length; i++) {
    const property = data[i];
    console.log(`\n[${i + 1}/${data.length}] Property: ${property.title}`);

    // Update main image
    const mainQuery = property.bhk === 1 ? 'studio apartment interior' :
                      property.bhk === 2 ? 'modern 2bhk apartment' :
                      property.bhk === 3 ? 'luxury 3bhk apartment' :
                      'luxury villa interior';

    const mainImage = await fetchPexelsImage(mainQuery);
    if (mainImage) {
      property.image = mainImage;
      mainImagesUpdated++;
    }

    // Update gallery images
    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        const query = getQueryForCaption(img.caption);
        const imageUrl = await fetchPexelsImage(query);
        if (imageUrl) {
          img.url = imageUrl;
          galleryImagesUpdated++;
        }
      }
    }

    updated++;

    // Rate limiting: sleep 300ms between API calls to avoid rate limits
    if (i < data.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log('\n\n✅ Complete!\n');
  console.log('📊 Summary:');
  console.log(`  ✓ Properties processed: ${updated}`);
  console.log(`  ✓ Main images updated: ${mainImagesUpdated}`);
  console.log(`  ✓ Gallery images updated: ${galleryImagesUpdated}`);
  console.log(`  ✓ Total images updated: ${mainImagesUpdated + galleryImagesUpdated}`);
  console.log('\n💾 Data saved to data/properties.json');
}

populateImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
