const express = require('express');
const router = express.Router();

// In-memory storage for demo (in production, use proper database)
let analytics = {
  diagnoses: {
    total: 142,
    today: 8,
    thisWeek: 47,
    commonDiseases: [
      { name: 'Leaf Spot Disease', count: 34 },
      { name: 'Powdery Mildew', count: 28 },
      { name: 'Bacterial Blight', count: 22 },
      { name: 'Rust Disease', count: 18 }
    ]
  },
  crops: {
    total: 89,
    popular: [
      { name: 'tomato', count: 45, icon: '🍅' },
      { name: 'rice', count: 38, icon: '🌾' },
      { name: 'onion', count: 32, icon: '🧅' },
      { name: 'potato', count: 28, icon: '🥔' },
      { name: 'wheat', count: 24, icon: '🌾' }
    ]
  },
  users: {
    total: 1247,
    active: 89,
    newToday: 12
  },
  queries: {
    voice: 567,
    text: 234,
    total: 801
  }
};

// Get analytics dashboard data
router.get('/admin/analytics', (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Generate time-series data for charts
    const generateTimeSeriesData = (days) => {
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          diagnoses: Math.floor(Math.random() * 20) + 5,
          queries: Math.floor(Math.random() * 50) + 10,
          users: Math.floor(Math.random() * 30) + 5
        });
      }
      return data;
    };

    const days = period === '30d' ? 30 : period === '7d' ? 7 : 1;
    const timeSeriesData = generateTimeSeriesData(days);

    res.json({
      ...analytics,
      period,
      timeSeries: timeSeriesData,
      performance: {
        avgResponseTime: '2.3s',
        uptime: '99.8%',
        errorRate: '0.2%'
      },
      languages: [
        { code: 'kn', name: 'Kannada', usage: 45 },
        { code: 'hi', name: 'Hindi', usage: 32 },
        { code: 'en', name: 'English', usage: 23 }
      ],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message 
    });
  }
});

// Get system health
router.get('/admin/health', (req, res) => {
  const health = {
    status: 'healthy',
    services: {
      database: { status: 'up', responseTime: '45ms' },
      storage: { status: 'up', responseTime: '123ms' },
      vertexAI: { 
        status: process.env.VERTEX_API_KEY ? 'up' : 'demo',
        responseTime: '1.2s' 
      },
      agmarknet: { 
        status: process.env.AGMARKNET_API_KEY ? 'up' : 'demo',
        responseTime: '890ms' 
      }
    },
    resources: {
      cpu: Math.floor(Math.random() * 30) + 20 + '%',
      memory: Math.floor(Math.random() * 40) + 30 + '%',
      disk: Math.floor(Math.random() * 20) + 15 + '%'
    },
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  };

  res.json(health);
});

// Get recent activities/logs
router.get('/admin/activities', (req, res) => {
  const { limit = 50 } = req.query;
  
  const activities = [
    {
      id: 1,
      type: 'diagnosis',
      message: 'Plant disease diagnosed: Leaf Spot Disease',
      user: 'user_123',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      metadata: { confidence: 87, language: 'kn' }
    },
    {
      id: 2,
      type: 'query',
      message: 'Voice query processed: "tomato price today"',
      user: 'user_456',
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
      metadata: { language: 'hi', duration: '3.2s' }
    },
    {
      id: 3,
      type: 'scheme',
      message: 'Scheme search: "drip irrigation subsidy"',
      user: 'user_789',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
      metadata: { results: 3, language: 'en' }
    },
    {
      id: 4,
      type: 'price',
      message: 'Market price query: onion',
      user: 'user_321',
      timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
      metadata: { market: 'Bangalore APMC', language: 'kn' }
    }
  ];

  res.json({
    activities: activities.slice(0, parseInt(limit)),
    total: activities.length,
    limit: parseInt(limit)
  });
});

// Update analytics (for demo purposes)
router.post('/admin/analytics/increment', (req, res) => {
  const { type, crop, disease } = req.body;
  
  try {
    switch (type) {
      case 'diagnosis':
        analytics.diagnoses.total += 1;
        analytics.diagnoses.today += 1;
        if (disease) {
          const existing = analytics.diagnoses.commonDiseases.find(d => d.name === disease);
          if (existing) {
            existing.count += 1;
          } else {
            analytics.diagnoses.commonDiseases.push({ name: disease, count: 1 });
          }
        }
        break;
        
      case 'crop':
        if (crop) {
          const existing = analytics.crops.popular.find(c => c.name === crop);
          if (existing) {
            existing.count += 1;
          } else {
            analytics.crops.popular.push({ name: crop, count: 1, icon: '🌱' });
          }
        }
        break;
        
      case 'query':
        analytics.queries.total += 1;
        break;
    }
    
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update analytics' });
  }
});

// Export analytics data
router.get('/admin/export', (req, res) => {
  const { format = 'json' } = req.query;
  
  if (format === 'csv') {
    // Generate CSV format
    let csv = 'Type,Name,Count,Date\n';
    analytics.diagnoses.commonDiseases.forEach(disease => {
      csv += `disease,${disease.name},${disease.count},${new Date().toISOString()}\n`;
    });
    analytics.crops.popular.forEach(crop => {
      csv += `crop,${crop.name},${crop.count},${new Date().toISOString()}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="kisan-analytics.csv"');
    res.send(csv);
  } else {
    res.json({
      exportedAt: new Date().toISOString(),
      data: analytics
    });
  }
});

module.exports = router;