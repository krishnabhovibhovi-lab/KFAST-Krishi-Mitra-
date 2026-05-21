export interface APMCPriceItem {
  id: string;
  market: string;
  district: string;
  crop: string;
  priceMin: number;
  priceMax: number;
  priceTrend: "UP" | "DOWN" | "STABLE";
  arrival: string;
}

export interface SoilAnalysisInput {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  organicCarbon: string;
}

export interface SoilAnalysisResult {
  status: "Excellent" | "Moderate" | "Depleted" | "Healthy";
  issues: string[];
  recommendations: string[];
  ratings: {
    n: string;
    p: string;
    k: string;
    ph: string;
    oc: string;
  };
}

export interface DroneBookingInput {
  farmerName: string;
  phone: string;
  district: string;
  taluk: string;
  cropType: string;
  acreage: number;
  serviceType: "Spraying (Insecticides/Pesticides)" | "Nutrient Spraying" | "Crop Health Mapping" | "Purchase Demonstration";
  preferredDate: string;
}

export interface DroneBookingOutput extends DroneBookingInput {
  id: string;
  bookingTime: string;
  estimatedCost: number;
  status: "Scheduled" | "Confirmed" | "Completed" | "Pending";
}

export interface CropInsuranceBooking {
  farmerName: string;
  aadhaar: string;
  surveyNumber: string;
  crop: string;
  acreage: number;
  premiumAmount: number;
  insuredValue: number;
  season: "Kharif 2026" | "Rabi 2026";
  subidizedPremium: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface IoTSensorNode {
  nodeId: string;
  location: string;
  soilMoisture: number; // %
  leafWetness: number;  // %
  temperature: number;   // °C
  humidity: number;      // %
  lastUpdated: string;
}

export interface InputDistributionProduct {
  id: string;
  name: string;
  category: "Seeds" | "Organic Pesticides" | "Fertilizers" | "Micro-nutrients";
  brand: string;
  price: number;
  unit: string;
  availability: boolean;
  karnatakaSubsidy: number; // percentage
  rating: number;
  description: string;
}
