const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/yescapa-vehicles.json'), 'utf-8'));
const slugToFind = 'camping-car-profile-julien-vouzailles-68245';

const found = data.find(v => v.slug === slugToFind || v.id === slugToFind);
console.log('Found:', found ? found.name : 'NOT FOUND');
