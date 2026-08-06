const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeYescapa() {
  console.log('🚀 Lancement du scraper Yescapa...');
  
  // Configuration du navigateur pour contourner les protections basiques
  const browser = await puppeteer.launch({
    headless: "new", // Utilise le nouveau mode headless de Chrome
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled', // Cache le fait qu'on est un bot
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  
  // Set d'un User-Agent réaliste
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Contournement supplémentaire pour WebDriver
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    const url = 'https://www.yescapa.fr/louer-un-camping-car/';
    console.log(`📡 Navigation vers ${url}...`);
    
    // On attend que le réseau soit calme pour être sûr que tout a chargé
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('✅ Page chargée. Début de l\'extraction...');

    // Attendre que les cartes de véhicules soient dans le DOM
    // Le sélecteur dépend du code source actuel de yescapa.
    // Nous utilisons ici une logique générique basée sur des classes communes.
    await page.waitForSelector('article', { timeout: 10000 }).catch(() => console.log('⚠️ Aucun article trouvé rapidement, on continue...'));

    // Scraping des éléments
    const vehicles = await page.evaluate(() => {
      const results = [];
      // Sélectionne tous les conteneurs d'annonces (les balises article sont souvent utilisées)
      const cards = document.querySelectorAll('article');

      cards.forEach((card, index) => {
        try {
          // Extraction du titre (Nom du véhicule)
          const titleEl = card.querySelector('h2') || card.querySelector('h3');
          const name = titleEl ? titleEl.innerText.trim() : `Véhicule Scrappé #${index + 1}`;

          // Extraction du prix (souvent contient un symbole €)
          const priceText = card.innerText.match(/(\d+)[\s]*€/);
          const pricePerDay = priceText ? parseInt(priceText[1]) : 100;

          // Extraction de la localisation
          const locationEl = card.querySelector('.location, [class*="location"], [class*="city"]');
          const location = locationEl ? locationEl.innerText.trim() : 'Inconnue';

          // Extraction de l'image (chercher une balise img)
          const imgEl = card.querySelector('img');
          const image = imgEl ? (imgEl.src || imgEl.getAttribute('data-src')) : 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80';

          // Extraction des attributs (places, lits, etc.)
          // C'est souvent dans une liste <ul> ou <div> avec des icones
          const detailsText = card.innerText.toLowerCase();
          const seatsMatch = detailsText.match(/(\d+)[\s]*place(s)?/);
          const seats = seatsMatch ? parseInt(seatsMatch[1]) : 4;
          
          const bedsMatch = detailsText.match(/(\d+)[\s]*couchage(s)?/);
          const beds = bedsMatch ? parseInt(bedsMatch[1]) : 2;

          results.push({
            id: `yescapa-${Date.now()}-${index}`,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name,
            type: 'fourgon_amenege', // Par défaut, à affiner selon mots-clés
            description: 'Véhicule importé depuis Yescapa.',
            pricePerDay: pricePerDay,
            seats: seats,
            beds: beds,
            features: ['Scrappé via script'],
            images: [image],
            available: true,
            location: location,
            owner: {
              name: 'Propriétaire Yescapa',
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
          console.error(`Erreur sur une carte:`, e);
        }
      });
      return results;
    });

    console.log(`🎉 Scraping terminé ! ${vehicles.length} véhicules trouvés.`);
    
    // Sauvegarde dans un fichier JSON local
    const outputPath = path.join(__dirname, 'scraped-vehicles.json');
    fs.writeFileSync(outputPath, JSON.stringify(vehicles, null, 2), 'utf-8');
    
    console.log(`💾 Données sauvegardées dans ${outputPath}`);
    console.log('💡 Note : Vous pouvez maintenant lire ce fichier JSON et l\'importer dans Firebase via un autre script d\'importation.');

  } catch (error) {
    console.error('❌ Une erreur est survenue pendant le scraping :', error);
  } finally {
    await browser.close();
  }
}

scrapeYescapa();
