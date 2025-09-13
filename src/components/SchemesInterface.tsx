import { useState } from "react";
import { ArrowLeft, Search, ExternalLink, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SchemesInterfaceProps {
  onBack: () => void;
}

interface Scheme {
  id: string;
  title: string;
  title_kn: string;
  description: string;
  description_kn: string;
  category: string;
  subsidy: string;
  eligibility: string[];
  eligibility_kn: string[];
  documents: string[];
  department: string;
}

const SchemesInterface = ({ onBack }: SchemesInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const schemes: Scheme[] = [
    {
      id: "pm-kisan",
      title: "PM-KISAN Samman Nidhi",
      title_kn: "ಪಿಎಂ-ಕಿಸಾನ್ ಸನ್ಮಾನ್ ನಿಧಿ",
      description: "Direct income support to farmers",
      description_kn: "ರೈತರಿಗೆ ನೇರ ಆದಾಯ ಬೆಂಬಲ - ವರ್ಷಕ್ಕೆ ₹6000",
      category: "income",
      subsidy: "₹6000/year",
      eligibility: ["Small & marginal farmers", "Land ownership required"],
      eligibility_kn: ["ಸಣ್ಣ ಮತ್ತು ಕಕ್ಷಿದ ರೈತರು", "ಭೂಮಿ ಮಾಲಿಕತ್ವ ಅಗತ್ಯ"],
      documents: ["Aadhaar", "Land Records", "Bank Account"],
      department: "Ministry of Agriculture"
    },
    {
      id: "drip-irrigation",
      title: "Micro Irrigation Scheme",
      title_kn: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಯೋಜನೆ",
      description: "Subsidy for drip and sprinkler irrigation",
      description_kn: "ಡ್ರಿಪ್ ಮತ್ತು ಸ್ಪ್ರಿಂಕ್ಲರ್ ನೀರಾವರಿಗೆ ಸಬ್ಸಿಡಿ",
      category: "irrigation",
      subsidy: "Up to 55%",
      eligibility: ["All farmers", "Minimum 0.4 hectare land"],
      eligibility_kn: ["ಎಲ್ಲಾ ರೈತರು", "ಕನಿಷ್ಠ 0.4 ಹೆಕ್ಟೇರ್ ಭೂಮಿ"],
      documents: ["Land Records", "Estimate", "Bank Details"],
      department: "Horticulture Department"
    },
    {
      id: "crop-insurance",
      title: "Pradhan Mantri Fasal Bima Yojana",
      title_kn: "ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬೀಮಾ ಯೋಜನೆ",
      description: "Crop insurance against natural calamities",
      description_kn: "ನೈಸರ್ಗಿಕ ವಿಪತ್ತುಗಳಿಂದ ಬೆಳೆ ಸಂರಕ್ಷಣೆ",
      category: "insurance",
      subsidy: "Premium subsidy",
      eligibility: ["All farmers", "Notified crops only"],
      eligibility_kn: ["ಎಲ್ಲಾ ರೈತರು", "ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳು ಮಾತ್ರ"],
      documents: ["Aadhaar", "Land Records", "Sowing Certificate"],
      department: "Agriculture Department"
    },
    {
      id: "solar-pump",
      title: "Solar Pump Subsidy",
      title_kn: "ಸೌರ ಪಂಪ್ ಸಬ್ಸಿಡಿ",
      description: "Subsidy for solar water pumps",
      description_kn: "ಸೌರ ನೀರು ಪಂಪ್‌ಗಳಿಗೆ ಸಬ್ಸಿಡಿ",
      category: "energy",
      subsidy: "Up to 90%",
      eligibility: ["Farmers with irrigation land", "No existing electricity connection"],
      eligibility_kn: ["ನೀರಾವರಿ ಭೂಮಿ ಇರುವ ರೈತರು", "ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ವಿದ್ಯುತ್ ಸಂಪರ್ಕವಿಲ್ಲ"],
      documents: ["Land Records", "NOC from Electricity Board", "Technical Feasibility"],
      department: "Renewable Energy Department"
    }
  ];

  const categories = [
    { id: "all", label: "ಎಲ್ಲಾ", label_en: "All" },
    { id: "income", label: "ಆದಾಯ", label_en: "Income" },
    { id: "irrigation", label: "ನೀರಾವರಿ", label_en: "Irrigation" },
    { id: "insurance", label: "ಬೀಮೆ", label_en: "Insurance" },
    { id: "energy", label: "ಶಕ್ತಿ", label_en: "Energy" }
  ];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = 
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.title_kn.includes(searchQuery) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description_kn.includes(searchQuery);
    
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "income": return "bg-success/20 text-success-foreground";
      case "irrigation": return "bg-primary/20 text-primary-foreground";
      case "insurance": return "bg-warning/20 text-warning-foreground";
      case "energy": return "bg-accent/20 text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

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
            ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು
          </h2>
          <p className="text-muted-foreground">
            Government Schemes & Subsidies
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ಯೋಜನೆ ಹುಡುಕಿ... • Search schemes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredSchemes.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                ಯಾವುದೇ ಯೋಜನೆ ಸಿಗಲಿಲ್ಲ • No schemes found
              </p>
            </Card>
          ) : (
            filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {scheme.title_kn}
                      </h3>
                      <Badge className={getCategoryColor(scheme.category)}>
                        {scheme.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {scheme.title}
                    </p>
                    <p className="text-foreground mb-3">
                      {scheme.description_kn}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="flex items-center text-success font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {scheme.subsidy}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      ಅರ್ಹತೆ • Eligibility
                    </h4>
                    <ul className="text-sm text-muted-foreground ml-5">
                      {scheme.eligibility_kn.map((item, index) => (
                        <li key={index} className="mb-1">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      ಅಗತ್ಯ ದಾಖಲೆಗಳು • Required Documents
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {scheme.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      {scheme.department}
                    </p>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      ಅರ್ಜಿ ಸಲ್ಲಿಸಿ
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <h3 className="font-medium mb-2 text-primary">
            📋 ಸಲಹೆಗಳು • Application Tips
          </h3>
          <ul className="text-sm text-primary/80 space-y-1">
            <li>• ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಗೊಳಿಸಿ ಇರಿಸಿ</li>
            <li>• ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಮಾತ್ರ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ</li>
            <li>• ಯಾವುದೇ ಅನಧಿಕೃತ ದಲ್ಲಾಳಿಗಳಿಗೆ ಹಣ ಕೊಡಬೇಡಿ</li>
            <li>• ಅರ್ಜಿಯ ಸ್ಥಿತಿಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SchemesInterface;