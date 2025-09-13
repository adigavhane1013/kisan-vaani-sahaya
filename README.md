# Project Kisan - Voice-first Multimodal Agronomy Assistant

A Progressive Web App (PWA) designed for Kannada-speaking smallholder farmers, featuring voice-first interaction, camera-based disease diagnosis, market price lookup, and government scheme information.

## 🌾 Features

- **🎙️ Voice Query**: Voice-powered agricultural assistance in Kannada
- **📸 Camera Diagnosis**: AI-powered crop disease detection and remedies
- **📊 Market Prices**: Real-time crop pricing from local markets
- **🏛️ Government Schemes**: Simplified access to agricultural subsidies and schemes
- **📱 PWA Support**: Works offline with cached data
- **🌍 Offline-first**: Last-known prices and FAQs cached locally

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Required for production features
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Backend API URL (when implemented)
VITE_API_BASE_URL=http://localhost:3001/api

# Demo mode (set to 'true' for testing without AI services)
VITE_DEMO_MODE=true
```

### Backend Setup (Coming Soon)

The backend will be implemented with Node.js/Express and include:

```bash
# Backend structure (to be implemented)
backend/
├── src/
│   ├── routes/
│   │   ├── upload.js       # Image upload to Firebase
│   │   ├── diagnose.js     # Vertex AI disease detection
│   │   ├── stt.js         # Speech-to-text
│   │   ├── tts.js         # Text-to-speech  
│   │   ├── price.js       # Market price API
│   │   └── scheme.js      # Government schemes RAG
│   ├── services/
│   │   ├── vertexai.js    # Vertex AI integration
│   │   ├── firebase.js    # Firebase services
│   │   └── agmarknet.js   # Market price scraping
│   └── app.js
├── package.json
└── README.md

# Backend environment variables needed:
VERTEX_API_KEY=your_vertex_ai_key
FIREBASE_SERVICE_ACCOUNT=path_to_service_account.json
AGMARKNET_API_URL=https://agmarknet.gov.in/api
```

## 🎨 Design System

The app uses an earth-inspired agricultural theme:

- **Primary**: Deep forest green (`hsl(145 60% 25%)`)
- **Success**: Fresh crop green (`hsl(120 65% 45%)`)  
- **Accent**: Golden harvest yellow (`hsl(43 85% 65%)`)
- **Warning**: Sunset orange (`hsl(25 85% 65%)`)

## 📱 PWA Features

- ✅ Offline caching with Service Worker
- ✅ App manifest for installation
- ✅ Responsive design for mobile-first usage
- ✅ Touch-friendly interface with large buttons
- ✅ Local storage for market prices and FAQs

## 🌐 Language Support

- **Primary**: Kannada (ಕನ್ನಡ) - Native interface
- **Secondary**: English - For technical terms and fallbacks

## 🔧 Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling  
- **shadcn/ui** components
- **Lucide React** for icons
- **React Query** for API state management
- **Vite** for build tooling

### Backend (Planned)
- **Node.js** with Express
- **Firebase** (Auth, Storage, Firestore)
- **Google Vertex AI** (Vision, Gemini, STT, TTS)
- **AgMarkNet/eNAM** APIs for price data

## 🎯 Demo Mode

The app includes a demo mode for testing without external API dependencies:

- Set `VITE_DEMO_MODE=true` in environment
- Returns predefined Kannada responses
- Simulates AI analysis with realistic delays
- Perfect for development and demonstrations

## 🚀 Deployment

### Frontend Deployment
```bash
# Build the app
npm run build

# Deploy to any static hosting service
# (Netlify, Vercel, Firebase Hosting, etc.)
```

### Firebase Setup (Required for full features)
1. Create a new Firebase project
2. Enable Authentication, Firestore, and Storage
3. Add your Firebase config to environment variables
4. Set up storage rules for image uploads

## 🔒 Security Notes

- Image uploads are processed server-side only
- API keys are never exposed to the frontend
- All AI processing happens on the backend
- Rate limiting implemented for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the [documentation](docs/) for detailed guides

---

**Project Kisan** - Empowering farmers with technology 🌾