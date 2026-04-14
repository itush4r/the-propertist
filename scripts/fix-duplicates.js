const fs = require('fs');
const path = require('path');

// Diverse image URLs to use for replacements
const imageVariety = [
  "https://images.pexels.com/photos/34538288/pexels-photo-34538288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/36777913/pexels-photo-36777913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/9757618/pexels-photo-9757618.png?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/8641925/pexels-photo-8641925.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6588595/pexels-photo-6588595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/27562215/pexels-photo-27562215.png?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/7546767/pexels-photo-7546767.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/3701455/pexels-photo-3701455.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6969994/pexels-photo-6969994.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/34076456/pexels-photo-34076456.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/30445143/pexels-photo-30445143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
];

const dataPath = path.join(__dirname, '../data/properties.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Track image count per property for better variety
let imageIndexCounter = 0;

// Process each property
data.forEach((property) => {
  if (property.images && Array.isArray(property.images)) {
    // Ensure no more than 3 images per property and use varied images
    if (property.images.length > 0) {
      const maxImages = Math.min(property.images.length, 4); // Keep at most 4 images

      // Replace images with variety
      for (let i = 0; i < maxImages; i++) {
        const imageIndex = (imageIndexCounter + i) % imageVariety.length;
        property.images[i] = {
          url: imageVariety[imageIndex],
          caption: property.images[i].caption || `Photo ${i + 1}`
        };
      }

      // Keep only the images we reassigned
      property.images = property.images.slice(0, maxImages);
      imageIndexCounter += maxImages;
    }
  }

  // Also update the single image field with variety
  const mainImageIndex = imageIndexCounter % imageVariety.length;
  property.image = imageVariety[mainImageIndex];
  imageIndexCounter++;
});

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('✓ Removed duplicate images and added variety!');
