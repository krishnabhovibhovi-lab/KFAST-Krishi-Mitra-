import { InputDistributionProduct, IoTSensorNode } from "./types";

export const KARNATAKA_DISTRICTS = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayapura",
  "Yadgir"
];

export const CORRESPONDING_SUPPORT_CENTRES: Record<string, string> = {
  "Bangalore Urban": "Yeshwanthpur Main KFAST hub, Contact: 080-2342555",
  "Davanagere": "Davanagere APMC Market Centre, Contact: 08192-23456",
  "Dharwad": "Hubli Bypass Regional Centre, Contact: 0836-223400",
  "Shivamogga": "Shimoga Central Agro-Tech Cell, Contact: 08182-44221",
  "Kalaburagi": "Kalaburagi Pulses Park Station, Contact: 08472-88112",
  "Mysuru": "Mysuru KFAST Rythu Bhavan, Contact: 0821-224433"
};

export const INPUT_CATALOG: InputDistributionProduct[] = [
  {
    id: "p1",
    name: "KFAST Premium Sona Masuri Certified Seeds (R-1)",
    category: "Seeds",
    brand: "Karnataka State Seeds Corp Ltd",
    price: 950,
    unit: "25 Kg Bag",
    availability: true,
    karnatakaSubsidy: 50,
    rating: 4.8,
    description: "High germination rate, short duration Sona Masuri variety resistant to blast and brown spot."
  },
  {
    id: "p2",
    name: "Karnataka Siri-Ragi Certified High Yield Seeds",
    category: "Seeds",
    brand: "KFAST Seeds",
    price: 320,
    unit: "5 Kg Bag",
    availability: true,
    karnatakaSubsidy: 60,
    rating: 4.9,
    description: "Drought resistant, fortified hybrid Ragi seeds specifically suited for Southern dry tracts."
  },
  {
    id: "p3",
    name: "Bio-Neem Organic Insecticide & Pest Repellent",
    category: "Organic Pesticides",
    brand: "Varuna Agro-Bio",
    price: 450,
    unit: "1 Litre Can",
    availability: true,
    karnatakaSubsidy: 25,
    rating: 4.6,
    description: "Pure cold-pressed neem kernel extract rich in Azadirachtin, ideal for crop protection against sap-feeders."
  },
  {
    id: "p4",
    name: "N-P-K 19:19:19 Water Soluble Fertilizer",
    category: "Fertilizers",
    brand: "IFFCO Karnataka",
    price: 180,
    unit: "1 Kg Pack",
    availability: true,
    karnatakaSubsidy: 30,
    rating: 4.7,
    description: "Multi-nutrient foliar spray fertilizer for uniform vegetative growth and root stability."
  },
  {
    id: "p5",
    name: "Micro-Nutrient Mixture for Arecanut and Coconut",
    category: "Micro-nutrients",
    brand: "Karnataka Agri Labs",
    price: 1200,
    unit: "10 Kg Bucket",
    availability: true,
    karnatakaSubsidy: 40,
    rating: 4.9,
    description: "Consolidated dose of Boron, Zinc, Iron, and Manganese to prevent nut-dropping and yellow leaf disease."
  },
  {
    id: "p6",
    name: "KFAST Trichoderma Viride Bio-Fungicide",
    category: "Organic Pesticides",
    brand: "Agri Biotech Hub",
    price: 250,
    unit: "1 Kg Pack",
    availability: true,
    karnatakaSubsidy: 50,
    rating: 4.5,
    description: "Natural antagonist against root rot, wilt, and damping-off diseases in spices, legumes, and cereals."
  }
];

export const INITIAL_IOT_NODES: IoTSensorNode[] = [
  {
    nodeId: "KFT-IOT-01",
    location: "Davanagere - Maize Field (South Sector)",
    soilMoisture: 42.5,
    leafWetness: 12.0,
    temperature: 29.8,
    humidity: 62.0,
    lastUpdated: "5 mins ago"
  },
  {
    nodeId: "KFT-IOT-02",
    location: "Shivamogga - Arecanut Plantation (Block B)",
    soilMoisture: 68.2,
    leafWetness: 34.5,
    temperature: 24.5,
    humidity: 82.5,
    lastUpdated: "12 mins ago"
  },
  {
    nodeId: "KFT-IOT-03",
    location: "Hubli - Chilly Crop (Zone Alpha)",
    soilMoisture: 31.0,
    leafWetness: 8.5,
    temperature: 32.1,
    humidity: 48.0,
    lastUpdated: "2 mins ago"
  },
  {
    nodeId: "KFT-IOT-04",
    location: "Kalaburagi - Toor Dal Field (Eastern Dryland)",
    soilMoisture: 24.8,
    leafWetness: 4.0,
    temperature: 36.4,
    humidity: 35.0,
    lastUpdated: "Just now"
  }
];
