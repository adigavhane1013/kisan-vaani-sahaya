import { useState, useEffect } from "react";
import { ArrowLeft, Search, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MarketPricesProps {
  onBack: () => void;
}

interface PriceData {
  crop: string;
  crop_kn: string;
  price: string;
  change: number;
  market: string;
  lastUpdated: string;
}

const MarketPrices = ({ onBack }: MarketPricesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo market data
  const demoData: PriceData[] = [
    {
      crop: "Tomato",
      crop_kn: "ಟೊಮೇಟೊ",
      price: "₹25-30/kg",
      change: 8.5,
      market: "Bengaluru APMC",
      lastUpdated: "2 hours ago"
    },
    {
      crop: "Onion",
      crop_kn: "ಈರುಳ್ಳಿ",
      price: "₹18-22/kg",
      change: -5.2,
      market: "Mysore Market",
      lastUpdated: "3 hours ago"
    },
    {
      crop: "Rice",
      crop_kn: "ಅಕ್ಕಿ",
      price: "₹35-40/kg",
      change: 2.1,
      market: "Mandya Mandi",
      lastUpdated: "4 hours ago"
    },
    {
      crop: "Sugarcane",
      crop_kn: "ಕಬ್ಬು",
      price: "₹2800-3200/ton",
      change: 12.3,
      market: "Belgaum Sugar Factory",
      lastUpdated: "1 hour ago"
    },
    {
      crop: "Banana",
      crop_kn: "ಬಾಳೆಹಣ್ಣು",
      price: "₹15-20/dozen",
      change: -2.8,
      market: "Hassan Market",
      lastUpdated: "5 hours ago"
    },
    {
      crop: "Coconut",
      crop_kn: "ತೆಂಗು",
      price: "₹25-30/piece",
      change: 6.7,
      market: "Coastal Karnataka",
      lastUpdated: "6 hours ago"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setPrices(demoData);
      setLoading(false);
      
      // Cache data for offline use
      localStorage.setItem('kisan-market-prices', JSON.stringify({
        data: demoData,
        timestamp: Date.now()
      }));
    }, 1500);
  }, []);

  const filteredPrices = prices.filter(
    price =>
      price.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.crop_kn.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          ಹಿಂತಿರುಗಿ
        </Button>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು
          </h2>
          <p className="text-muted-foreground">
            Market Prices - Live Updates
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ಬೆಳೆ ಹುಡುಕಿ... • Search crop"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrices.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                  ಯಾವುದೇ ಬೆಳೆ ಸಿಗಲಿಲ್ಲ • No crops found
                </p>
              </Card>
            ) : (
              filteredPrices.map((price, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {price.crop_kn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {price.crop}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {price.price}
                      </p>
                      <div className={`flex items-center text-sm ${
                        price.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {price.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(price.change)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {price.market}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    ಕೊನೆಯ ನವೀಕರಣ: {price.lastUpdated} • Last updated: {price.lastUpdated}
                  </p>
                </Card>
              ))
            )}
          </div>
        )}

        <Card className="p-4 bg-accent/10 border-accent/20">
          <h3 className="font-medium mb-2 text-accent-foreground">
            💡 ಸಲಹೆ • Tips
          </h3>
          <ul className="text-sm text-accent-foreground/80 space-y-1">
            <li>• ಬೆಳಿಗ್ಗೆ ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗಿ ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ</li>
            <li>• ಗುಣಮಟ್ಟದ ಬೆಳೆ ಇರುವುದು ಬೆಲೆ ಹೆಚ್ಚಿಸುತ್ತದೆ</li>
            <li>• ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಿಗಳೊಂದಿಗೆ ಸಂಬಂಧ ಬೆಳೆಸಿರಿ</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices;