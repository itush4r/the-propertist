const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/properties.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Map of keywords to property categories
const categoryKeywords = {
  'villa': ['villa', 'bungalow'],
  'apartment': ['apartment', 'apt', 'flat', 'penthouse'],
  'house': ['house', 'home', 'cottage', 'farmhouse'],
  'townhouse': ['townhouse', 'town house'],
  'studio': ['studio'],
  'duplex': ['duplex'],
};

// Function to extract property category from title
const extractCategory = (title) => {
  const lowerTitle = title.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerTitle.includes(keyword)) {
        return category.charAt(0).toUpperCase() + category.slice(1);
      }
    }
  }

  // Default to Apartment if no match found
  return 'Apartment';
};

// Add propertyCategory to each property
data.forEach((property) => {
  property.propertyCategory = extractCategory(property.title);
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('✓ Added propertyCategory to all properties!');
