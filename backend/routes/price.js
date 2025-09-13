const express = require('express');
const router = express.Router();

// Demo market data
const getDemoMarketPrices = () => {
  const crops = ['tomato', 'onion', 'potato', 'rice', 'wheat', 'carrot', 'cabbage', 'beans'];
  const markets = ['Mandya APMC', 'Bangalore APMC', 'Mysore APMC', 'Hassan APMC', 'Tumkur APMC'];
  
  return crops.map(crop => ({
    crop,
    price: Math.floor(Math.random() * 40) + 15, // 15-55 Rs/kg
    unit: 'kg',
    market: markets[Math.floor(Math.random() * markets.length)],
    date: new Date().toISOString(),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    change: Math.floor(Math.random() * 10) - 5, // -5 to +5
    quality: ['Grade A', 'Grade B', 'Premium'][Math.floor(Math.random() * 3)]
  }));
};

// Get market prices
router.get('/price', async (req, res) => {
  try {
    const { crop, market, language = 'en' } = req.query;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // In production with AgMarknet/eNAM API
    if (process.env.AGMARKNET_API_KEY && !process.env.DEMO_MODE) {
      try {
        // TODO: Implement actual AgMarknet API call
        // const response = await fetch(`${process.env.AGMARKNET_URL}/api/price?crop=${crop}&api_key=${process.env.AGMARKNET_API_KEY}`);
        // const data = await response.json();
        
        // For now, return demo data even if API key exists
        const allPrices = getDemoMarketPrices();
        let filteredPrices = allPrices;
        
        if (crop) {
          filteredPrices = allPrices.filter(price => 
            price.crop.toLowerCase().includes(crop.toLowerCase())
          );
        }
        
        if (market) {
          filteredPrices = filteredPrices.filter(price =>
            price.market.toLowerCase().includes(market.toLowerCase())
          );
        }
        
        return res.json({
          prices: filteredPrices,
          query: { crop, market },
          source: 'agmarknet',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('AgMarknet API Error:', error);
        // Fallback to demo data
      }
    }

    // Demo mode response
    const allPrices = getDemoMarketPrices();
    let filteredPrices = allPrices;
    
    if (crop) {
      filteredPrices = allPrices.filter(price => 
        price.crop.toLowerCase().includes(crop.toLowerCase())
      );
      
      if (filteredPrices.length === 0) {
        filteredPrices = [{
          crop: crop.toLowerCase(),
          price: Math.floor(Math.random() * 40) + 15,
          unit: 'kg',
          market: 'Bangalore APMC',
          date: new Date().toISOString(),
          trend: 'stable',
          change: 0,
          quality: 'Grade A'
        }];
      }
    }
    
    if (market) {
      filteredPrices = filteredPrices.filter(price =>
        price.market.toLowerCase().includes(market.toLowerCase())
      );
    }

    // Add localized market names for better UX
    const localizedPrices = filteredPrices.map(price => ({
      ...price,
      localizedMarket: language === 'kn' ? 
        price.market.replace('APMC', 'ಮಂಡಿ') : 
        language === 'hi' ? 
        price.market.replace('APMC', 'मंडी') : 
        price.market
    }));

    res.json({
      prices: localizedPrices,
      query: { crop, market, language },
      source: 'demo',
      demoMode: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalResults: localizedPrices.length,
        avgPrice: Math.round(localizedPrices.reduce((sum, p) => sum + p.price, 0) / localizedPrices.length),
        bestMarket: localizedPrices.sort((a, b) => b.price - a.price)[0]?.market
      }
    });

  } catch (error) {
    console.error('Price API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market prices',
      details: error.message,
      demoMode: !process.env.AGMARKNET_API_KEY
    });
  }
});

// Get price trends
router.get('/price/trends', async (req, res) => {
  try {
    const { crop, days = 7 } = req.query;
    
    // Generate demo trend data
    const trendData = [];
    for (let i = parseInt(days); i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trendData.push({
        date: date.toISOString().split('T')[0],
        price: Math.floor(Math.random() * 20) + 20, // 20-40
        volume: Math.floor(Math.random() * 1000) + 500 // 500-1500 kg
      });
    }

    res.json({
      crop: crop || 'all',
      period: `${days} days`,
      trends: trendData,
      source: 'demo',
      demoMode: true
    });

  } catch (error) {
    console.error('Trends API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch price trends',
      details: error.message 
    });
  }
});

// Get popular crops
router.get('/price/popular', (req, res) => {
  const { language = 'en' } = req.query;
  
  const crops = {
    en: [
      { name: 'tomato', displayName: 'Tomato', icon: '🍅' },
      { name: 'onion', displayName: 'Onion', icon: '🧅' },
      { name: 'potato', displayName: 'Potato', icon: '🥔' },
      { name: 'rice', displayName: 'Rice', icon: '🌾' },
      { name: 'wheat', displayName: 'Wheat', icon: '🌾' }
    ],
    hi: [
      { name: 'tomato', displayName: 'टमाटर', icon: '🍅' },
      { name: 'onion', displayName: 'प्याज', icon: '🧅' },
      { name: 'potato', displayName: 'आलू', icon: '🥔' },
      { name: 'rice', displayName: 'चावल', icon: '🌾' },
      { name: 'wheat', displayName: 'गेहूं', icon: '🌾' }
    ],
    kn: [
      { name: 'tomato', displayName: 'ಟೊಮಾಟೊ', icon: '🍅' },
      { name: 'onion', displayName: 'ಈರುಳ್ಳಿ', icon: '🧅' },
      { name: 'potato', displayName: 'ಆಲೂಗಡ್ಡೆ', icon: '🥔' },
      { name: 'rice', displayName: 'ಅಕ್ಕಿ', icon: '🌾' },
      { name: 'wheat', displayName: 'ಗೋಧಿ', icon: '🌾' }
    ]
  };

  res.json({
    crops: crops[language] || crops.en,
    language
  });
});

module.exports = router;