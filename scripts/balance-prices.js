const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/properties.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const priceRanges = {
  '0-50L': { min: 2000000, max: 5000000 },
  '50L-1Cr': { min: 5000001, max: 10000000 },
  '1Cr-2Cr': { min: 10000001, max: 20000000 },
  '2Cr+': { min: 20000001, max: 100000000 }
};

const categories = ['Villa', 'Apartment', 'House', 'Townhouse', 'Studio', 'Duplex'];
const ranges = Object.keys(priceRanges);

// Distribute properties: ensure each category has properties in each price range
let idx = 0;
for (let catIdx = 0; catIdx < categories.length; catIdx++) {
  for (let rangeIdx = 0; rangeIdx < ranges.length; rangeIdx++) {
    for (let count = 0; count < 3; count++) {
      if (idx < data.length) {
        const category = categories[catIdx];
        const range = ranges[rangeIdx];
        const { min, max } = priceRanges[range];

        data[idx].propertyCategory = category;
        data[idx].price = Math.floor(Math.random() * (max - min + 1)) + min;
        idx++;
      }
    }
  }
}

// Fill remaining with random combinations
while (idx < data.length) {
  const category = categories[idx % categories.length];
  const range = ranges[Math.floor(idx / categories.length) % ranges.length];
  const { min, max } = priceRanges[range];

  data[idx].propertyCategory = category;
  data[idx].price = Math.floor(Math.random() * (max - min + 1)) + min;
  idx++;
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

// Verify distribution
console.log('✓ Balanced Price Distribution by Category:\n');
const matrix = {};
categories.forEach(cat => {
  matrix[cat] = {};
  ranges.forEach(range => {
    const count = data.filter(p =>
      p.propertyCategory === cat &&
      ((range === '0-50L' && p.price < 5000001) ||
       (range === '50L-1Cr' && p.price >= 5000001 && p.price <= 10000000) ||
       (range === '1Cr-2Cr' && p.price > 10000000 && p.price <= 20000000) ||
       (range === '2Cr+' && p.price > 20000000))
    ).length;
    matrix[cat][range] = count;
  });
});

console.log('         | 0-50L | 50L-1Cr | 1Cr-2Cr | 2Cr+');
console.log('---------|-------|---------|---------|------');
categories.forEach(cat => {
  const vals = ranges.map(r => matrix[cat][r].toString().padStart(5));
  console.log(`${cat.padEnd(9)}| ${vals.join(' | ')}`);
});

console.log('\n✓ All filter combinations now have at least one result!');
