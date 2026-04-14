const fs = require('fs');
const path = require('path');

const PEXELS_API_KEY = 'zhoZyoXvGzeLeAfQHsycBXLfvMutZiGNLsiLkj1TdpE71ThwwSgocCgD';

// Massive pool of diverse queries for maximum variety
const expandedQueryVariations = {
  'Living Room': [
    'modern living room interior',
    'contemporary apartment living',
    'luxury living space',
    'apartment lounge design',
    'minimalist living room',
    'modern sofa living room',
    'spacious living area',
    'apartment living room design',
    'bright modern living',
    'luxury apartment lounge',
    'small apartment living room',
    'scandinavian living room',
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
    'cozy bedroom apartment',
    'minimalist bedroom',
    'luxury bed room',
    'modern master bedroom design',
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
    'marble kitchen',
    'luxury kitchen appliances',
    'apartment kitchen ideas',
    'modern kitchen island',
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
    'luxury balcony',
    'modern patio design',
    'apartment deck',
    'city balcony view',
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
    'minimalist dining',
    'bright dining room',
    'luxury dining furniture',
    'modern dining interior',
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
    'small balcony design',
    'urban balcony',
    'balcony seating',
    'modern outdoor furniture',
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
    'marble bathroom',
    'bright bathroom',
    'luxury bathroom fixtures',
    'modern bathroom remodel',
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
    'minimalist hallway',
    'apartment entryway',
    'modern entry design',
    'luxury hallway',
  ],
};

// Cache for API responses
let apiCallCount = 0;
const imageCache = {};

async function fetchPexelsImages(query) {
  if (imageCache[query]) {
    return imageCache[query];
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&page=${Math.floor(Math.random() * 3) + 1}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    apiCallCount++;
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
  for (const [key, queries] of Object.entries(expandedQueryVariations)) {
    if (caption.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(caption.toLowerCase())) {
      return queries;
    }
  }
  return expandedQueryVariations['Living Room'];
}

async function populateMaxUniqueImages() {
  const dataPath = path.join(__dirname, '../data/properties.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('🚀 Fetching MAXIMUM UNIQUE images from Pexels...\n');
  console.log(`📊 Processing ${data.length} properties\n`);

  const uniqueImageUrls = new Set();
  const imagePool = {}; // Store large pools of images

  // Collect all unique captions
  const allCaptions = new Set();
  data.forEach(prop => {
    if (prop.images) {
      prop.images.forEach(img => {
        allCaptions.add(img.caption);
      });
    }
  });

  console.log(`Found ${allCaptions.size} unique caption types\n`);
  console.log('📥 Pre-fetching image pools...\n');

  let poolIndex = 0;
  for (const caption of allCaptions) {
    const queries = getQueriesForCaption(caption);

    if (!imagePool[caption]) {
      console.log(`[${++poolIndex}/${allCaptions.size}] ${caption}`);
      let allImages = [];

      // Fetch from all query variations
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        const images = await fetchPexelsImages(query);
        allImages = allImages.concat(images);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));

        // Progress
        process.stdout.write(`\r  📸 Fetched from query ${i + 1}/${queries.length}...`);
      }

      // Remove duplicates
      allImages = [...new Set(allImages)];
      imagePool[caption] = allImages;
      console.log(`\r  ✓ ${allImages.length} unique images collected\n`);
    }
  }

  // Assign images to properties
  console.log('\n📝 Assigning unique images to properties...\n');

  const captionIndices = {};

  for (let i = 0; i < data.length; i++) {
    const property = data[i];
    console.log(`[${i + 1}/${data.length}] ${property.title}`);

    // Assign main image with variety
    const mainQueries = [
      'luxury apartment building',
      'modern apartment complex',
      'residential apartment',
      'apartment exterior',
      'modern residential',
      'luxury residential',
      'apartment building design'
    ];

    const mainIdx = i % mainQueries.length;
    const mainImages = await fetchPexelsImages(mainQueries[mainIdx]);
    if (mainImages.length > 0) {
      property.image = mainImages[i % mainImages.length];
      uniqueImageUrls.add(property.image);
    }

    // Assign gallery images
    if (property.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        if (imagePool[img.caption] && imagePool[img.caption].length > 0) {
          if (!captionIndices[img.caption]) {
            captionIndices[img.caption] = 0;
          }

          const images = imagePool[img.caption];
          const idx = captionIndices[img.caption] % images.length;
          img.url = images[idx];
          uniqueImageUrls.add(img.url);
          captionIndices[img.caption]++;
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Save
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  console.log('\n\n✅ Complete!\n');
  console.log('📊 Summary:');
  console.log(`  ✓ API calls made: ${apiCallCount}`);
  console.log(`  ✓ Unique images collected: ${uniqueImageUrls.size}`);
  console.log(`  ✓ Coverage: ${((uniqueImageUrls.size / 400) * 100).toFixed(1)}%`);
  console.log(`\n💾 Data saved to data/properties.json`);
}

populateMaxUniqueImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
