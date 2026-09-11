const fs = require('fs');
const path = require('path');

const yescapa = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/yescapa-vehicles.json'), 'utf8'));

console.log('Total in yescapa-vehicles.json:', yescapa.length);

const ids = new Set();
const slugs = new Set();
const names = new Set();
let dupId = 0, dupSlug = 0, dupName = 0;
const byType = {};
const pricesByType = {};

for (const v of yescapa) {
  if (ids.has(v.id)) dupId++; else ids.add(v.id);
  if (slugs.has(v.slug)) dupSlug++; else slugs.add(v.slug);
  if (names.has(v.name)) dupName++; else names.add(v.name);
  
  byType[v.type] = (byType[v.type] || 0) + 1;
  if (!pricesByType[v.type]) pricesByType[v.type] = [];
  pricesByType[v.type].push(v.pricePerDay);
}

console.log('Duplicate counts - ID:', dupId, 'Slug:', dupSlug, 'Name:', dupName);
console.log('Vehicles by Type:');
for (const [type, count] of Object.entries(byType)) {
  const prices = pricesByType[type];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a,b)=>a+b,0) / prices.length);
  console.log(`- ${type}: ${count} vehicles | Min: ${min}€, Max: ${max}€, Avg: ${avg}€`);
}
