const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/properties.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Core amenities to ensure every property has
const coreAmenities = [
  'AC',
  'Club House',
  'Clubhouse',
  'Concierge',
  'Coworking',
  'Furnished',
  'Parking',
  'Security',
  'Gym',
  'Pool',
  'WiFi',
  'Balcony',
  'Garden',
  'Servant Quarter',
  'Power Backup',
  'Lift',
  'Water Storage',
  'Intercom'
];

// Ensure every property has at least 3 amenities
data.forEach((property, idx) => {
  // If property has less than 3 amenities, add more
  if (!property.amenities || property.amenities.length < 3) {
    property.amenities = [];

    // Add 3-5 random amenities
    const numAmenities = Math.floor(Math.random() * 3) + 3; // 3-5 amenities
    const shuffled = [...coreAmenities].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numAmenities && i < shuffled.length; i++) {
      if (!property.amenities.includes(shuffled[i])) {
        property.amenities.push(shuffled[i]);
      }
    }
  } else {
    // Ensure at least 3 from core list
    let coreCount = property.amenities.filter(a => coreAmenities.includes(a)).length;

    if (coreCount < 3) {
      const shuffled = coreAmenities
        .filter(a => !property.amenities.includes(a))
        .sort(() => Math.random() - 0.5);

      for (let i = 0; coreCount < 3 && i < shuffled.length; i++) {
        property.amenities.push(shuffled[i]);
        coreCount++;
      }
    }
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

// Verify
const stats = {
  totalProperties: data.length,
  propertiesWithAt3: data.filter(p => p.amenities.length >= 3).length,
  minAmenities: Math.min(...data.map(p => p.amenities.length)),
  maxAmenities: Math.max(...data.map(p => p.amenities.length)),
  avgAmenities: (data.reduce((sum, p) => sum + p.amenities.length, 0) / data.length).toFixed(1)
};

console.log('✓ Amenities Updated!');
console.log(`  Total properties: ${stats.totalProperties}`);
console.log(`  Properties with ≥3 amenities: ${stats.propertiesWithAt3}`);
console.log(`  Min amenities per property: ${stats.minAmenities}`);
console.log(`  Max amenities per property: ${stats.maxAmenities}`);
console.log(`  Average amenities per property: ${stats.avgAmenities}`);
