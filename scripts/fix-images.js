const fs = require('fs');
const path = require('path');

// Real, working Pexels images from your original data
const propertyImages = [
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

let imageIndex = 0;

data.forEach((property, propIndex) => {
  // For main image field - rotate through images
  property.image = propertyImages[imageIndex % propertyImages.length];

  // For carousel images - use different images for each
  if (property.images && Array.isArray(property.images)) {
    const numImages = Math.min(property.images.length, 4);
    property.images = [];

    for (let i = 0; i < numImages; i++) {
      const imgIdx = (imageIndex + i) % propertyImages.length;
      property.images.push({
        url: propertyImages[imgIdx],
        caption: `Photo ${i + 1}`
      });
    }
  }

  // Move to next image for next property (skip by 2 for better variety)
  imageIndex += 2;
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✓ Fixed images! Using ${propertyImages.length} real working Pexels images`);
