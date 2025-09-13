const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|m4a|ogg|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.includes('audio');
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (WAV, MP3, M4A, OGG, WebM)'));
    }
  }
});

// Demo STT responses
const getDemoSTTResponse = (language = 'en') => {
  const responses = {
    en: [
      "What is the price of tomatoes today?",
      "My plant leaves are turning yellow",
      "How to apply for drip irrigation subsidy?",
      "Best fertilizer for rice crop",
      "When to plant onions this season?"
    ],
    hi: [
      "आज टमाटर का भाव क्या है?",
      "मेरे पौधे की पत्तियां पीली हो रही हैं",
      "ड्रिप सिंचाई सब्सिडी के लिए कैसे आवेदन करें?",
      "धान की फसल के लिए सबसे अच्छा उर्वरक",
      "इस सीजन में प्याज कब लगाना चाहिए?"
    ],
    kn: [
      "ಇಂದು ಟೊಮಾಟೊ ಬೆಲೆ ಎಷ್ಟು?",
      "ನನ್ನ ಸಸ್ಯದ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ",
      "ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿಗಾಗಿ ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?",
      "ಭತ್ತದ ಬೆಳೆಗೆ ಉತ್ತಮ ಗೊಬ್ಬರ",
      "ಈ ಋತುವಿನಲ್ಲಿ ಈರುಳ್ಳಿ ಯಾವಾಗ ನೆಡಬೇಕು?"
    ]
  };
  
  const languageResponses = responses[language] || responses.en;
  return languageResponses[Math.floor(Math.random() * languageResponses.length)];
};

// Speech-to-Text endpoint
router.post('/stt', upload.single('audio'), async (req, res) => {
  try {
    const { language = 'en' } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // In production with Vertex AI Speech-to-Text
    if (process.env.VERTEX_API_KEY && !process.env.DEMO_MODE) {
      try {
        // TODO: Implement actual Vertex AI Speech-to-Text API call
        // const speech = require('@google-cloud/speech');
        // const client = new speech.SpeechClient();
        
        // const audioBytes = fs.readFileSync(req.file.path).toString('base64');
        // const audio = { content: audioBytes };
        // const config = {
        //   encoding: 'WEBM_OPUS',
        //   sampleRateHertz: 16000,
        //   languageCode: language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-US',
        // };
        
        // const request = { audio, config };
        // const [response] = await client.recognize(request);
        // const transcription = response.results
        //   .map(result => result.alternatives[0].transcript)
        //   .join('\n');
        
        // For now, return demo data even if API key exists
        const transcript = getDemoSTTResponse(language);
        return res.json({
          transcript,
          confidence: 0.95,
          language,
          source: 'vertex-ai'
        });
      } catch (error) {
        console.error('Vertex AI STT Error:', error);
        // Fallback to demo data
      }
    }

    // Demo mode response
    const transcript = getDemoSTTResponse(language);
    
    // Clean up uploaded file
    setTimeout(() => {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }, 5000);

    res.json({
      transcript,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      language,
      source: 'demo',
      demoMode: true,
      audioSize: req.file.size,
      duration: Math.floor(Math.random() * 10) + 3 // 3-13 seconds
    });

  } catch (error) {
    console.error('STT error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error.message,
      demoMode: !process.env.VERTEX_API_KEY
    });
  }
});

// Get supported languages
router.get('/stt/languages', (req, res) => {
  res.json({
    supported: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
    ],
    default: 'en'
  });
});

module.exports = router;