const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/properties.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Distribute properties across all categories more evenly
const categories = ['Villa', 'Apartment', 'House', 'Townhouse', 'Studio', 'Duplex'];
const totalProperties = data.length;
const propertiesPerCategory = Math.floor(totalProperties / categories.length);

// Reassign categories in a distributed way
let categoryIndex = 0;
data.forEach((property, idx) => {
  categoryIndex = idx % categories.length;
  property.propertyCategory = categories[categoryIndex];
});

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

// Verify distribution
const distribution = {};
data.forEach(p => {
  distribution[p.propertyCategory] = (distribution[p.propertyCategory] || 0) + 1;
});

console.log('✓ Property Category Distribution:');
Object.entries(distribution).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count} properties`);
});
