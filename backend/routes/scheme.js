const express = require('express');
const router = express.Router();

// Demo government schemes data
const getDemoSchemes = (language = 'en') => {
  const schemes = {
    en: [
      {
        id: 1,
        name: "PM-KISAN Scheme",
        description: "Direct income support to farmer families",
        benefit: "₹6,000 per year in 3 installments",
        eligibility: "Small and marginal farmers with up to 2 hectares",
        documents: ["Aadhaar Card", "Bank Account", "Land Records"],
        applyUrl: "https://pmkisan.gov.in",
        category: "income-support"
      },
      {
        id: 2,
        name: "Drip Irrigation Subsidy",
        description: "Subsidy for micro irrigation systems",
        benefit: "Up to 55% subsidy on drip irrigation systems",
        eligibility: "All farmers with valid land records",
        documents: ["Land Records", "Bank Account", "Aadhaar Card"],
        applyUrl: "https://pmksy.gov.in",
        category: "irrigation"
      },
      {
        id: 3,
        name: "Crop Insurance Scheme",
        description: "Insurance coverage for crop losses",
        benefit: "Insurance coverage up to sum insured",
        eligibility: "All farmers growing notified crops",
        documents: ["Land Records", "Bank Account", "Sowing Certificate"],
        applyUrl: "https://pmfby.gov.in",
        category: "insurance"
      }
    ],
    hi: [
      {
        id: 1,
        name: "पीएम-किसान योजना",
        description: "किसान परिवारों को प्रत्यक्ष आय सहायता",
        benefit: "3 किस्तों में ₹6,000 प्रति वर्ष",
        eligibility: "2 हेक्टेयर तक के छोटे और सीमांत किसान",
        documents: ["आधार कार्ड", "बैंक खाता", "भूमि रिकॉर्ड"],
        applyUrl: "https://pmkisan.gov.in",
        category: "income-support"
      },
      {
        id: 2,
        name: "ड्रिप सिंचाई सब्सिडी",
        description: "सूक्ष्म सिंचाई प्रणालियों के लिए अनुदान",
        benefit: "ड्रिप सिंचाई प्रणालियों पर 55% तक सब्सिडी",
        eligibility: "वैध भूमि रिकॉर्ड वाले सभी किसान",
        documents: ["भूमि रिकॉर्ड", "बैंक खाता", "आधार कार्ड"],
        applyUrl: "https://pmksy.gov.in",
        category: "irrigation"
      }
    ],
    kn: [
      {
        id: 1,
        name: "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ",
        description: "ರೈತ ಕುಟುಂಬಗಳಿಗೆ ನೇರ ಆದಾಯ ಬೆಂಬಲ",
        benefit: "3 ಕಂತುಗಳಲ್ಲಿ ವರ್ಷಕ್ಕೆ ₹6,000",
        eligibility: "2 ಹೆಕ್ಟೇರ್ ವರೆಗಿನ ಸಣ್ಣ ಮತ್ತು ಅಂಚಿನ ರೈತರು",
        documents: ["ಆಧಾರ್ ಕಾರ್ಡ್", "ಬ್ಯಾಂಕ್ ಖಾತೆ", "ಭೂಮಿ ದಾಖಲೆಗಳು"],
        applyUrl: "https://pmkisan.gov.in",
        category: "income-support"
      },
      {
        id: 2,
        name: "ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ",
        description: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಗಳಿಗೆ ಅನುದಾನ",
        benefit: "ಹನಿ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಗಳ ಮೇಲೆ 55% ವರೆಗೆ ಸಬ್ಸಿಡಿ",
        eligibility: "ಮಾನ್ಯ ಭೂಮಿ ದಾಖಲೆಗಳಿರುವ ಎಲ್ಲಾ ರೈತರು",
        documents: ["ಭೂಮಿ ದಾಖಲೆಗಳು", "ಬ್ಯಾಂಕ್ ಖಾತೆ", "ಆಧಾರ್ ಕಾರ್ಡ್"],
        applyUrl: "https://pmksy.gov.in",
        category: "irrigation"
      }
    ]
  };
  
  return schemes[language] || schemes.en;
};

// Search government schemes
router.get('/scheme', async (req, res) => {
  try {
    const { q: query, category, language = 'en', explainMode = 'farmer' } = req.query;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // In production, this would use a vector database for RAG
    if (process.env.VECTOR_DB_URL && !process.env.DEMO_MODE) {
      try {
        // TODO: Implement RAG pipeline with vector database
        // const vectorResults = await searchVectorDB(query, language);
        // const llmResponse = await generateExplanation(vectorResults, explainMode, language);
        
        // For now, return demo data even if DB is configured
        let schemes = getDemoSchemes(language);
        
        if (query) {
          schemes = schemes.filter(scheme =>
            scheme.name.toLowerCase().includes(query.toLowerCase()) ||
            scheme.description.toLowerCase().includes(query.toLowerCase()) ||
            scheme.category === query.toLowerCase()
          );
        }
        
        if (category) {
          schemes = schemes.filter(scheme => scheme.category === category);
        }
        
        return res.json({
          schemes,
          query,
          source: 'vector-db',
          explainMode,
          language
        });
      } catch (error) {
        console.error('Vector DB Error:', error);
        // Fallback to demo data
      }
    }

    // Demo mode - simple text matching
    let schemes = getDemoSchemes(language);
    
    if (query) {
      const searchTerm = query.toLowerCase();
      schemes = schemes.filter(scheme =>
        scheme.name.toLowerCase().includes(searchTerm) ||
        scheme.description.toLowerCase().includes(searchTerm) ||
        scheme.benefit.toLowerCase().includes(searchTerm) ||
        scheme.category === searchTerm
      );
      
      // Add common search mappings
      if (searchTerm.includes('subsidy') || searchTerm.includes('अनुदान') || searchTerm.includes('ಸಬ್ಸಿಡಿ')) {
        schemes = schemes.concat(getDemoSchemes(language).filter(s => s.category === 'irrigation'));
      }
      
      if (searchTerm.includes('insurance') || searchTerm.includes('बीमा') || searchTerm.includes('ವಿಮೆ')) {
        schemes = schemes.concat(getDemoSchemes(language).filter(s => s.category === 'insurance'));
      }
    }
    
    if (category) {
      schemes = schemes.filter(scheme => scheme.category === category);
    }

    // Remove duplicates
    schemes = schemes.filter((scheme, index, self) => 
      self.findIndex(s => s.id === scheme.id) === index
    );

    // Adjust explanation complexity based on mode
    if (explainMode === 'farmer') {
      schemes = schemes.map(scheme => ({
        ...scheme,
        description: scheme.description.length > 50 ? 
          scheme.description.substring(0, 50) + '...' : 
          scheme.description,
        simpleExplanation: true
      }));
    }

    res.json({
      schemes,
      query,
      category,
      totalResults: schemes.length,
      source: 'demo',
      demoMode: true,
      explainMode,
      language,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scheme search error:', error);
    res.status(500).json({ 
      error: 'Failed to search schemes',
      details: error.message,
      demoMode: !process.env.VECTOR_DB_URL
    });
  }
});

// Get scheme categories
router.get('/scheme/categories', (req, res) => {
  const { language = 'en' } = req.query;
  
  const categories = {
    en: [
      { id: 'income-support', name: 'Income Support', icon: '💰' },
      { id: 'irrigation', name: 'Irrigation', icon: '💧' },
      { id: 'insurance', name: 'Crop Insurance', icon: '🛡️' },
      { id: 'seeds', name: 'Seeds & Fertilizers', icon: '🌱' },
      { id: 'machinery', name: 'Farm Machinery', icon: '🚜' }
    ],
    hi: [
      { id: 'income-support', name: 'आय सहायता', icon: '💰' },
      { id: 'irrigation', name: 'सिंचाई', icon: '💧' },
      { id: 'insurance', name: 'फसल बीमा', icon: '🛡️' },
      { id: 'seeds', name: 'बीज और उर्वरक', icon: '🌱' },
      { id: 'machinery', name: 'कृषि मशीनरी', icon: '🚜' }
    ],
    kn: [
      { id: 'income-support', name: 'ಆದಾಯ ಬೆಂಬಲ', icon: '💰' },
      { id: 'irrigation', name: 'ನೀರಾವರಿ', icon: '💧' },
      { id: 'insurance', name: 'ಬೆಳೆ ವಿಮೆ', icon: '🛡️' },
      { id: 'seeds', name: 'ಬೀಜ ಮತ್ತು ಗೊಬ್ಬರ', icon: '🌱' },
      { id: 'machinery', name: 'ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳು', icon: '🚜' }
    ]
  };

  res.json({
    categories: categories[language] || categories.en,
    language
  });
});

// Get scheme by ID
router.get('/scheme/:id', (req, res) => {
  const { id } = req.params;
  const { language = 'en' } = req.query;
  
  const schemes = getDemoSchemes(language);
  const scheme = schemes.find(s => s.id === parseInt(id));
  
  if (!scheme) {
    return res.status(404).json({ error: 'Scheme not found' });
  }

  res.json({
    scheme,
    language,
    source: 'demo'
  });
});

module.exports = router;