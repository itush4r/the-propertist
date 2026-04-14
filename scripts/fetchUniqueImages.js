const fs = require('fs');
const path = require('path');

const PEXELS_API_KEY = 'zhoZyoXvGzeLeAfQHsycBXLfvMutZiGNLsiLkj1TdpE71ThwwSgocCgD';

// Expanded query variations for more variety
const queryVariations = {
  'Living Room': [
    'modern living room interior',
    'contemporary apartment living',
    'luxury living space',
    'apartment lounge design',
    'modern sofa living room',
    'spacious living area',
    'apartment living room design',
    'minimalist living room',
  ],
  'Master Bedroom': [
    'luxury master bedroom',
    'modern bedroom interior',
    'contemporary bedroom design',
    'elegant bedroom',
    'apartment bedroom',
    'master suite interior',
    'modern bedroom decor',
    'luxury bedroom design',
  ],
  'Modern Kitchen': [
    'modern kitchen interior',
    'luxury kitchen design',
    'contemporary kitchen',
    'apartment kitchen',
    'modern kitchenette',
    'bright kitchen',
    'luxury kitchen counters',
    'minimalist kitchen',
  ],
  'Outdoor Space': [
    'apartment balcony',
    'modern terrace',
    'balcony view',
    'apartment patio',
    'outdoor deck',
    'modern balcony design',
    'apartment outdoor space',
    'contemporary terrace',
  ],
  'Dining Area': [
    'modern dining room',
    'apartment dining',
    'luxury dining space',
    'contemporary dining',
    'modern dining table',
    'elegant dining room',
    'apartment dining design',
    'luxury dining',
  ],
  'Balcony': [
    'apartment balcony',
    'modern balcony design',
    'luxury balcony view',
    'city balcony',
    'apartment terrace',
    'balcony interior',
    'modern patio',
    'luxury outdoor space',
  ],
  'Bathroom': [
    'modern bathroom interior',
    'luxury bathroom design',
    'contemporary bathroom',
    'apartment bathroom',
    'modern bathroom decor',
    'spa bathroom',
    'luxury bathroom',
    'minimalist bathroom',
  ],
  'Entrance': [
    'modern apartment entrance',
    'luxury foyer',
    'apartment entrance design',
    'modern hallway',
    'contemporary entrance',
    'luxury entrance',
    'apartment foyer',
    'elegant entrance',
  ],
};

// Cache for fetched images
const imageCache = {};

async function fetchPexelsImages(query) {
  // Check cache
  if (imageCache[query]) {
    return imageCache[query];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8`,
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
      const urls = data.photos.map(photo => photo.src.large);
      imageCache[query] = urls;
      return urls;
    }

    return [];
  } catch (error) {
    console.error(`  ❌ Error fetching "${query}":`, error.message);
    return [];
  }
}

function getQueriesForCaption(caption) {
  for (const [key, queries] of Object.entries(queryVariations)) {
    if (caption.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(caption.toLowerCase())) {
      return queries;
    }
  }
  return queryVariations['Living Room'];
}

async function populateUniqueImages() {
  const dataPath = path.join(__dirname, '../data/properties.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('🚀 Fetching UNIQUE images from Pexels...\n');
  console.log(`📊 Processing ${data.length} properties\n`);

  let uniqueImages = new Set();
  const imagePool = {}; // Store pools of images by caption type

  // Pre-fetch image pools for all caption types
  console.log('📥 Pre-fetching image pools...\n');

  const allCaptions = new Set();
  data.forEach(prop => {
    if (prop.images) {
      prop.images.forEach(img => {
        allCaptions.add(img.caption);
      });
    }
  });

  for (const caption of allCaptions) {
    const queries = getQueriesForCaption(caption);
    const poolKey = queries[0]; // Use first query as key

    if (!imagePool[poolKey]) {
      console.log(`  📸 Fetching images for: "${caption}"`);
      let allImages = [];

      for (const query of queries) {
        const images = await fetchPexelsImages(query);
        allImages = allImages.concat(images);
        await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
      }

      imagePool[poolKey] = allImages;
      console.log(`     → Found ${allImages.length} unique images\n`);
    }
  }

  // Now assign unique images to each property
  console.log('\n📝 Assigning unique images to properties...\n');

  const captionIndices = {}; // Track which image index for each caption type

  for (let i = 0; i < data.length; i++) {
    const property = data[i];
    console.log(`[${i + 1}/${data.length}] ${property.title}`);

    // Update main image - use different query for variety
    const mainQuery = property.bhk === 1 ? 'modern studio apartment interior' :
                      property.bhk === 2 ? 'luxury 2 bedroom apartment interior' :
                      property.bhk === 3 ? 'elegant 3 bedroom apartment' :
                      'luxury villa interior design';

    const mainImages = await fetchPexelsImages(mainQuery);
    if (mainImages.length > 0) {
      const idx = i % mainImages.length;
      property.image = mainImages[idx];
      uniqueImages.add(property.image);
      console.log(`  ✓ Main image assigned`);
    }

    // Update gallery images
    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        const queries = getQueriesForCaption(img.caption);
        const poolKey = queries[0];

        if (imagePool[poolKey] && imagePool[poolKey].length > 0) {
          if (!captionIndices[poolKey]) {
            captionIndices[poolKey] = 0;
          }

          const images = imagePool[poolKey];
          const idx = captionIndices[poolKey] % images.length;
          img.url = images[idx];
          uniqueImages.add(img.url);
          captionIndices[poolKey]++;
          console.log(`  ✓ ${img.caption}`);
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log('\n\n✅ Complete!\n');
  console.log('📊 Summary:');
  console.log(`  ✓ Total unique images: ${uniqueImages.size}`);
  console.log(`  ✓ Coverage: ${((uniqueImages.size / 400) * 100).toFixed(1)}%`);
  console.log(`\n💾 Data saved to data/properties.json`);
}

populateUniqueImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
