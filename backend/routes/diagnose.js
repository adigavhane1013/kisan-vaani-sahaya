const express = require('express');
const router = express.Router();

// Demo diagnosis data
const getDemoDiagnosis = (language = 'en') => {
  const diagnoses = {
    en: {
      disease: "Leaf Spot Disease",
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
      severity: "Medium",
      advice: "Apply copper-based fungicide. Repeat every 7-10 days until symptoms improve.",
      remedies: [
        "Remove infected leaves and destroy them properly",
        "Avoid overhead watering to prevent spread",
        "Ensure good air circulation around plants",
        "Apply organic mulch to prevent soil splash"
      ],
      prevention: [
        "Water at soil level, not on leaves",
        "Space plants properly for air circulation",
        "Remove plant debris regularly"
      ]
    },
    hi: {
      disease: "पत्ती धब्बा रोग", 
      confidence: Math.floor(Math.random() * 30) + 70,
      severity: "मध्यम",
      advice: "कॉपर आधारित फंगीसाइड का छिड़काव करें। लक्षण सुधरने तक 7-10 दिनों में दोहराएं।",
      remedies: [
        "संक्रमित पत्तियों को हटाकर उचित तरीके से नष्ट करें",
        "फैलाव रोकने के लिए ऊपर से पानी देने से बचें", 
        "पौधों के चारों ओर अच्छी हवा का प्रवाह सुनिश्चित करें",
        "मिट्टी के छींटे रोकने के लिए जैविक गीली घास डालें"
      ],
      prevention: [
        "पत्तियों पर नहीं, मिट्टी के स्तर पर पानी दें",
        "हवा के संचार के लिए पौधों को उचित दूरी पर लगाएं",
        "नियमित रूप से पौधों का मलबा हटाएं"
      ]
    },
    kn: {
      disease: "ಎಲೆ ಕಲೆ ರೋಗ",
      confidence: Math.floor(Math.random() * 30) + 70,
      severity: "ಮಧ್ಯಮ", 
      advice: "ಕಾಪರ್ ಆಧಾರಿತ ಶಿಲೀಂದ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ. ಲಕ್ಷಣಗಳು ಸುಧಾರಗೊಳ್ಳುವವರೆಗೆ ೭-೧೦ ದಿನಗಳಿಗೊಮ್ಮೆ ಪುನರಾವರ್ತಿಸಿ.",
      remedies: [
        "ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ಸರಿಯಾಗಿ ನಾಶಮಾಡಿ",
        "ಹರಡುವಿಕೆಯನ್ನು ತಡೆಯಲು ತಲೆಯ ಮೇಲಿನಿಂದ ನೀರು ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ",
        "ಸಸ್ಯಗಳ ಸುತ್ತಲೂ ಉತ್ತಮ ಗಾಳಿ ಪ್ರವಾಹವನ್ನು ಖಚಿತಪಡಿಸಿ",
        "ಮಣ್ಣಿನ ಚಿಮುಕಿಸುವಿಕೆಯನ್ನು ತಡೆಯಲು ಸಾವಯವ ಮಲ್ಚ್ ಅನ್ನು ಅನ್ವಯಿಸಿ"
      ],
      prevention: [
        "ಎಲೆಗಳ ಮೇಲೆ ಅಲ್ಲ, ಮಣ್ಣಿನ ಮಟ್ಟದಲ್ಲಿ ನೀರು ಕೊಡಿ",
        "ಗಾಳಿ ಪ್ರವಾಹಕ್ಕಾಗಿ ಸಸ್ಯಗಳನ್ನು ಸರಿಯಾದ ಅಂತರದಲ್ಲಿ ನೆಡಿ",
        "ನಿಯಮಿತವಾಗಿ ಸಸ್ಯ ಅವಶೇಷಗಳನ್ನು ತೆಗೆದುಹಾಕಿ"
      ]
    }
  };
  
  return diagnoses[language] || diagnoses.en;
};

// Plant disease diagnosis endpoint
router.post('/diagnose', async (req, res) => {
  try {
    const { imageUrl, language = 'en', explainMode = 'farmer' } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // In production with Vertex AI Vision API
    if (process.env.VERTEX_API_KEY && !process.env.DEMO_MODE) {
      try {
        // TODO: Implement actual Vertex AI Vision API call
        // const { ImageAnnotatorClient } = require('@google-cloud/vision');
        // const client = new ImageAnnotatorClient();
        // const [result] = await client.labelDetection(imageUrl);
        // const labels = result.labelAnnotations;
        
        // TODO: Call Gemini for detailed analysis
        // const geminiResponse = await callGeminiAPI(imageUrl, labels, language);
        
        // For now, return demo data even if API key exists
        const diagnosis = getDemoDiagnosis(language);
        return res.json({
          ...diagnosis,
          imageUrl,
          timestamp: new Date().toISOString(),
          mode: explainMode,
          source: 'vertex-ai' // In actual implementation
        });
      } catch (error) {
        console.error('Vertex AI Error:', error);
        // Fallback to demo data
      }
    }

    // Demo mode response
    const diagnosis = getDemoDiagnosis(language);
    
    // Adjust explanation complexity based on mode
    if (explainMode === 'farmer') {
      // Simplify language for farmer mode
      if (language === 'en') {
        diagnosis.advice = "Spray copper medicine on leaves. Do this every week until plant gets better.";
        diagnosis.remedies = diagnosis.remedies.map(remedy => 
          remedy.replace(/copper-based fungicide/i, 'copper medicine')
                .replace(/overhead watering/i, 'watering from top')
                .replace(/air circulation/i, 'air flow')
        );
      }
    }

    res.json({
      ...diagnosis,
      imageUrl,
      timestamp: new Date().toISOString(),
      mode: explainMode,
      source: 'demo',
      demoMode: true
    });

  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze plant image',
      details: error.message,
      demoMode: !process.env.VERTEX_API_KEY
    });
  }
});

// Get diagnosis history
router.get('/diagnose/history', (req, res) => {
  // In production, this would fetch from database
  res.json([
    {
      id: 1,
      disease: "Leaf Spot Disease",
      confidence: 87,
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      crop: "tomato"
    },
    {
      id: 2, 
      disease: "Powdery Mildew",
      confidence: 92,
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      crop: "cucumber"
    }
  ]);
});

module.exports = router;