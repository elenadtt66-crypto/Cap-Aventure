const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Limite maximale de véhicules à scraper pour éviter les blocages infinis
const MAX_VEHICLES = 5000;
const OUTPUT_FILE = path.join(__dirname, '../data/yescapa-vehicles.json');

async function randomDelay(min = 2000, max = 5000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function scrapeMassYescapa() {
  console.log('🚀 Lancement du Scraper Massif Yescapa...');
  
  // Lecture de la base existante pour ne pas repartir de zéro si le script coupe
  let existingVehicles = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingVehicles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      console.log(`📦 ${existingVehicles.length} véhicules déjà en base.`);
    } catch (e) {
      console.log('Nouvelle base de données vide.');
    }
  }

  const browser = await puppeteer.launch({
    headless: false, // Affiché pour que l'humain puisse passer un Captcha si besoin
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  let currentPage = 1;
  let hasNextPage = true;
  let totalScraped = existingVehicles.length;

  try {
    while (hasNextPage && totalScraped < MAX_VEHICLES) {
      const url = `https://www.yescapa.fr/louer-un-camping-car/?page=${currentPage}`;
      console.log(`\n📡 Scraping de la page ${currentPage} : ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await randomDelay(); // Pause humaine
      
      // Accepter les cookies si le bandeau apparaît (1ère fois)
      if (currentPage === 1) {
        try {
          const cookieBtn = await page.$('#didomi-notice-agree-button');
          if (cookieBtn) {
            await cookieBtn.click();
            await randomDelay(1000, 2000);
          }
        } catch (e) {}
      }

      // Extraction des cartes de la page
      const newVehicles = await page.evaluate(() => {
        const results = [];
        const cards = document.querySelectorAll('article');

        cards.forEach((card, index) => {
          try {
            const titleEl = card.querySelector('h2') || card.querySelector('h3');
            const name = titleEl ? titleEl.innerText.trim() : `Yescapa #${Date.now()}-${index}`;

            const priceText = card.innerText.match(/(\d+)[\s]*€/);
            const pricePerDay = priceText ? parseInt(priceText[1]) : 100;

            const locationEl = card.querySelector('.location, [class*="location"], [class*="city"]');
            const location = locationEl ? locationEl.innerText.trim() : 'Inconnue';

            const imgEl = card.querySelector('img');
            const image = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('srcset')) : 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80';

            // Détection du type
            let type = 'fourgon_amenege';
            const textL = card.innerText.toLowerCase();
            if (textL.includes('van')) type = 'van_amenege';
            else if (textL.includes('capucine')) type = 'capucine';
            else if (textL.includes('profilé')) type = 'camping_car_profile';
            else if (textL.includes('intégral')) type = 'camping_car_integral';

            const seatsMatch = textL.match(/(\d+)[\s]*place(s)?/);
            const seats = seatsMatch ? parseInt(seatsMatch[1]) : 4;
            
            const bedsMatch = textL.match(/(\d+)[\s]*couchage(s)?/);
            const beds = bedsMatch ? parseInt(bedsMatch[1]) : 2;

            results.push({
              id: `yescapa-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30) + '-' + Math.floor(Math.random()*1000),
              name: name,
              type: type,
              description: 'Annonce Yescapa détaillée : \n' + card.innerText.replace(/\n+/g, ' | '),
              pricePerDay: pricePerDay,
              seats: seats,
              beds: beds,
              features: ['Véhicule vérifié', 'Assurance incluse'],
              images: [image],
              available: true,
              location: location,
              owner: {
                name: 'Propriétaire (Yescapa)',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                responseTime: 'Variable',
                responseRate: 100
              },
              techSpecs: {
                fuel: 'Diesel',
                transmission: 'Manuelle',
                consumption: '8L/100km',
                enginePower: '130 ch'
              },
              rating: 5.0,
              reviewCount: 0,
              reviews: []
            });
          } catch (e) {
            console.error(`Erreur carte:`, e);
          }
        });
        return results;
      });

      if (newVehicles.length === 0) {
        console.log('⚠️ Aucun véhicule trouvé sur cette page. Fin du scraping ou blocage.');
        hasNextPage = false;
      } else {
        existingVehicles.push(...newVehicles);
        totalScraped = existingVehicles.length;
        
        // Sauvegarde immédiate à chaque page
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingVehicles, null, 2), 'utf-8');
        console.log(`✅ ${newVehicles.length} véhicules extraits. Total: ${totalScraped}. Données sauvegardées.`);

        currentPage++;
        // On s'arrête arbitrairement après 100 pages pour un seul run pour ne pas saturer la RAM
        if (currentPage > 100) hasNextPage = false;
      }
    }

    console.log(`\n🎉 Scraping Massif terminé ! ${existingVehicles.length} véhicules au total.`);

  } catch (error) {
    console.error('❌ Erreur critique :', error);
  } finally {
    console.log('Fermeture du navigateur.');
    await browser.close();
  }
}

scrapeMassYescapa();
