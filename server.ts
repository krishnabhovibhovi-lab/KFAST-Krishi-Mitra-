import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Dynamic, Karnataka district-wise crop market price database (APMC)
const KarnatakaAPMCData = [
  { id: "1", market: "Bangalore (Yeshwanthpur)", district: "Bangalore Urban", crop: "Onion", priceMin: 1800, priceMax: 2400, priceTrend: "UP", arrival: "240 Tons" },
  { id: "2", market: "Bangalore (Yeshwanthpur)", district: "Bangalore Urban", crop: "Potato", priceMin: 1500, priceMax: 1900, priceTrend: "DOWN", arrival: "410 Tons" },
  { id: "3", market: "Bangalore (Yeshwanthpur)", district: "Bangalore Urban", crop: "Tomato", priceMin: 1200, priceMax: 1700, priceTrend: "STABLE", arrival: "180 Tons" },
  { id: "4", market: "Davanagere", district: "Davanagere", crop: "Maize", priceMin: 2150, priceMax: 2320, priceTrend: "UP", arrival: "810 Tons" },
  { id: "5", market: "Davanagere", district: "Davanagere", crop: "Paddy (Sona Masuri)", priceMin: 2200, priceMax: 2750, priceTrend: "UP", arrival: "340 Tons" },
  { id: "6", market: "Hubli", district: "Dharwad", crop: "Byadagi Chilly", priceMin: 18000, priceMax: 25000, priceTrend: "UP", arrival: "45 Tons" },
  { id: "7", market: "Hubli", district: "Dharwad", crop: "Cotton", priceMin: 6200, priceMax: 7000, priceTrend: "STABLE", arrival: "110 Tons" },
  { id: "8", market: "Shimoga", district: "Shivamogga", crop: "Arecanut (Rashi)", priceMin: 42000, priceMax: 48500, priceTrend: "STABLE", arrival: "65 Tons" },
  { id: "9", market: "Shimoga", district: "Shivamogga", crop: "Ginger", priceMin: 5000, priceMax: 7500, priceTrend: "UP", arrival: "35 Tons" },
  { id: "10", market: "Kalaburagi", district: "Kalaburagi", crop: "Toor Dal (Red Gram)", priceMin: 8500, priceMax: 10200, priceTrend: "UP", arrival: "190 Tons" },
  { id: "11", market: "Mysore", district: "Mysuru", crop: "Ragi (Finger Millet)", priceMin: 3100, priceMax: 3600, priceTrend: "STABLE", arrival: "80 Tons" },
  { id: "12", market: "Kolar", district: "Kolar", crop: "Tomato", priceMin: 1000, priceMax: 1550, priceTrend: "DOWN", arrival: "310 Tons" },
  { id: "13", market: "Gadag", district: "Gadag", crop: "Bengal Gram", priceMin: 5800, priceMax: 6500, priceTrend: "UP", arrival: "120 Tons" },
  { id: "14", market: "Bagalkot", district: "Bagalkot", crop: "Sugarcane", priceMin: 3100, priceMax: 3350, priceTrend: "STABLE", arrival: "1500 Tons" }
];

// 1. APMC Market Prices Endpoint
app.get("/api/market-prices", (req, res) => {
  const { crop, district } = req.query;
  let filtered = KarnatakaAPMCData;
  if (crop) {
    filtered = filtered.filter(item => item.crop.toLowerCase().includes((crop as string).toLowerCase()));
  }
  if (district) {
    filtered = filtered.filter(item => item.district.toLowerCase().includes((district as string).toLowerCase()));
  }
  res.json(filtered);
});

// 2. Soil card sample analyzer endpoint
app.post("/api/soil-analysis", (req, res) => {
  const { nitrogen, phosphorus, potassium, ph, organicCarbon } = req.body;
  const n = parseFloat(nitrogen) || 0;
  const p = parseFloat(phosphorus) || 0;
  const k = parseFloat(potassium) || 0;
  const phVal = parseFloat(ph) || 7.0;
  const oc = parseFloat(organicCarbon) || 0.5;

  // Simple and logical evaluation
  let status = "Healthy";
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (n < 280) {
    issues.push("Low Nitrogen (N)");
    recommendations.push("Apply Urea or grow nitrogen-fixing legume crops like Chickpea or Green gram.");
  } else if (n > 560) {
    issues.push("Excess Nitrogen (N)");
    recommendations.push("Reduce nitrogen fertilizer usage to prevent weak crop stems and pest vulnerability.");
  }

  if (p < 23) {
    issues.push("Low Phosphorus (P)");
    recommendations.push("Apply Single Super Phosphate (SSP) or Diammonium Phosphate (DAP) during sowing.");
  }

  if (k < 140) {
    issues.push("Low Potassium (K)");
    recommendations.push("Apply Muriate of Potash (MOP) to enhance drought resistance and disease immunity.");
  }

  if (phVal < 6.0) {
    issues.push("Acidic Soil (pH < 6.0)");
    recommendations.push("Apply agricultural lime (calcium carbonate) to neutralize acid and improve nutrient availability.");
  } else if (phVal > 8.0) {
    issues.push("Alkaline Soil (pH > 8.0)");
    recommendations.push("Apply gypsum or organic manure to reduce excessive alkalinity.");
  }

  if (oc < 0.5) {
    issues.push("Low Organic Carbon (OC)");
    recommendations.push("Incorporate farmyard manure, compost, or green manures like Sunnhemp or Dhaincha to enrich soil structure.");
  }

  if (issues.length === 0) {
    status = "Excellent";
    recommendations.push("Soil fertility is optimal! Maintain balance with balanced crop rotation and timely organic amendments.");
  } else if (issues.length <= 2) {
    status = "Moderate";
  } else {
    status = "Depleted";
  }

  res.json({
    status,
    issues,
    recommendations,
    ratings: {
      n: n < 280 ? "Low" : n > 560 ? "High" : "Optimal",
      p: p < 23 ? "Low" : p > 57 ? "High" : "Optimal",
      k: k < 140 ? "Low" : k > 330 ? "High" : "Optimal",
      ph: phVal < 6.0 ? "Acidic" : phVal > 8.0 ? "Alkaline" : "Neutral/Optimal",
      oc: oc < 0.5 ? "Low" : oc > 0.75 ? "High" : "Optimal"
    }
  });
});

// Lazy initialize Gemini clients safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please set it in the Settings > Secrets tab.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// 3. Farmer Assistant AI Advice Endpoint
app.post("/api/gemini", async (req, res) => {
  const { message, context } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message prompt is required." });
  }

  try {
    const ai = getGeminiClient();
    
    // Construct rich system instructions focusing on Karnataka farming context
    const systemInstruction = `
      You are "Krishi Mitra AI Assistant", an expert agricultural and livestock scientist working with KFAST (Karnataka Farmers Association and Smart Technology) in Karnataka.
      Your goal is to provide pragmatic, highly helpful, expert advisory to farmers in Karnataka.
      Format your response using Markdown. Use clean bullet points, bold text, and numbered lists where appropriate for absolute readability.
      Whenever a farmer asks a question:
      - Reply in a warm, respectful, and authoritative manner.
      - Refer to specific Karnataka regional conditions, districts, black/red/laterite soils, and irrigation solutions (like drip, sprinkler, Ganga Kalyana borewell scheme etc.).
      - Use standard crop names (Paddy/Bhattha, Ragi, Maize/Mekke Jola, Sugarcane/Kabbu, Cotton/Arale, Arecanut/Adike, Byadagi Chilly, Groundnut/Kadalekayi, etc.) and give practical advice.
      - Mention pest control, seed quality, sowing windows (Kharif/Mungaru, Rabi/Hingaru, Summer/Kar) in Karnataka.
      - Keep answers actionable, concise, and professional.
      - Integrate both English and occasional sweet Kannada agricultural phrases or terms in Kannada script if helpful (like "ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ", "ಕೃಷಿ ಭಾಗ್ಯ", "ಮಣ್ಣಿನ ಆರೋಗ್ಯ").
      - Provide helpful government schemes applicable in Karnataka like Ganga Kalyana, Krishi Bhagya, Parihara, PM-KISAN, crop insurance.
      - Give structured and exact treatment measures for pests.
    `;

    const cropContextStr = context ? `\n[Farmer Custom Farm Details: ${JSON.stringify(context)}]\n` : "";

    const userPrompt = `${cropContextStr}Farmer Question: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const advisoryText = response.text || "I was unable to formulate advisory at this moment, but please consult your nearest KFAST centre.";
    res.json({ text: advisoryText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return friendly local fallback when API Key is missing or invalid
    const isKeyMissing = error.message && error.message.includes("GEMINI_API_KEY");
    
    if (isKeyMissing) {
      res.json({
        text: `### 🌾 Krishi Mitra AI (Local Assistant Node)
Thank you for your question! I am running on the **KFAST Local Backup Advisor**. 

To unlock the full potential of live Gemini AI reasoning, please configure your **GEMINI_API_KEY** in the Secrets tab.

**Here is a quick Local Karnataka Farming Guideline for you:**
* **Rainfall & Sowing:** We are in the Mungaru (Kharif) / Hingaru (Rabi) season. Ensure your land is well ploughed to capture moisture.
* **Arecanut, Paddy, Coconut Protection:** Spray copper oxychloride (3g/L) to prevent rot disease triggered by heavy rainfall.
* **Karnataka Help:** Contact KFAST toll-free helpline at 1800-425-1555 for direct field support.`,
        localFallback: true
      });
    } else {
      res.status(500).json({ error: "Advisory system is temporarily unavailable. Please retry later.", details: error.message });
    }
  }
});

// Serve Vite Assets and SPAs
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KFAST Krishi Mitra] Fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
