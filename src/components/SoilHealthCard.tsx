import React, { useState } from "react";
import { Trees, Microscope, FileText, CheckCircle2, AlertTriangle, HelpCircle, FileCheck, Info, ShieldCheck } from "lucide-react";
import { SoilAnalysisInput, SoilAnalysisResult } from "../types";

export function SoilHealthCard() {
  const [inputs, setInputs] = useState<SoilAnalysisInput>({
    nitrogen: "210",
    phosphorus: "18",
    potassium: "125",
    ph: "5.8",
    organicCarbon: "0.45"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SoilAnalysisResult | null>({
    status: "Moderate",
    issues: ["Low Nitrogen (N)", "Low Phosphorus (P)", "Low Potassium (K)", "Acidic Soil (pH < 6.0)", "Low Organic Carbon (OC)"],
    recommendations: [
      "Apply Urea or grow nitrogen-fixing legume crops like Chickpea or Green gram.",
      "Apply Single Super Phosphate (SSP) or Diammonium Phosphate (DAP) during sowing.",
      "Apply Muriate of Potash (MOP) to enhance drought resistance and disease immunity.",
      "Apply agricultural lime (calcium carbonate) to neutralize acid and improve nutrient availability.",
      "Incorporate farmyard manure, compost, or green manures like Sunnhemp or Dhaincha to enrich soil structure."
    ],
    ratings: {
      n: "Low",
      p: "Low",
      k: "Low",
      ph: "Acidic",
      oc: "Low"
    }
  });

  const handlePresetSelect = (preset: "red-soil" | "black-soil" | "sandy-coastal") => {
    if (preset === "red-soil") {
      setInputs({ nitrogen: "310", phosphorus: "28", potassium: "210", ph: "6.5", organicCarbon: "0.62" });
    } else if (preset === "black-soil") {
      setInputs({ nitrogen: "260", phosphorus: "15", potassium: "340", ph: "8.2", organicCarbon: "0.51" });
    } else {
      setInputs({ nitrogen: "180", phosphorus: "12", potassium: "90", ph: "5.2", organicCarbon: "0.38" });
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/soil-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
      case "Healthy":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20";
      case "Moderate":
        return "bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20";
      case "Depleted":
      default:
        return "bg-rose-50 text-rose-800 border-rose-200 ring-rose-500/20";
    }
  };

  const getMetricRatingColor = (rating: string) => {
    if (rating === "Optimal" || rating === "Healthy" || rating === "Neutral/Optimal") return "text-emerald-700 bg-emerald-50 font-semibold border-emerald-100";
    if (rating === "Low" || rating === "Acidic" || rating === "Alkaline") return "text-amber-700 bg-amber-50 font-semibold border-amber-100";
    return "text-rose-700 bg-rose-50 font-semibold border-rose-100";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="soil_health_card_tab">
      
      {/* Input Form Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Microscope className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Knowing Soil, Increase Yield</h3>
              <p className="text-xs text-slate-500 font-medium">Input soil test parameters to generate card</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase block mb-2">Karnataka Soil Type Presets:</span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                onClick={() => handlePresetSelect("red-soil")}
                className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-center whitespace-nowrap transition"
              >
                🔴 Red Soil (Areca)
              </button>
              <button 
                type="button" 
                onClick={() => handlePresetSelect("black-soil")}
                className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-center whitespace-nowrap transition"
              >
                ⚫ Black Soil (Cotton)
              </button>
              <button 
                type="button" 
                onClick={() => handlePresetSelect("sandy-coastal")}
                className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer text-center whitespace-nowrap transition"
              >
                🏖️ Coastal Acidic
              </button>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Available Nitrogen (N)</span>
                <span className="text-[10px] font-mono text-slate-400 lowercase">Target: 280-560 kg/ha</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="number"
                  required
                  value={inputs.nitrogen}
                  onChange={(e) => setInputs({ ...inputs, nitrogen: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  placeholder="240"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs text-slate-400 font-mono">kg/ha</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Phosphorus (P)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={inputs.phosphorus}
                    onChange={(e) => setInputs({ ...inputs, phosphorus: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    placeholder="15"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-slate-400 font-mono">kg/ha</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Potassium (K)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={inputs.potassium}
                    onChange={(e) => setInputs({ ...inputs, potassium: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    placeholder="220"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-slate-400 font-mono">kg/ha</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Soil pH Level</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={inputs.ph}
                  onChange={(e) => setInputs({ ...inputs, ph: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  placeholder="6.8"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Organic Carbon</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={inputs.organicCarbon}
                    onChange={(e) => setInputs({ ...inputs, organicCarbon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    placeholder="0.5"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-slate-400 font-mono">%</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-center py-3 px-4 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-emerald-600 transition cursor-pointer"
            >
              {isLoading ? "Analyzing Soil Chemical Balance..." : "Generate Soil Health Card 🌱"}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start space-x-3">
          <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-0.5">Where is my physically collected sample?</p>
            KFAST connects field extension officers directly to villages. Hand over soil bags, and your verified digital report will instantly sync here under your Rythu ID.
          </div>
        </div>
      </div>

      {/* Output Health Card Column */}
      <div className="lg:col-span-7">
        {result ? (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
            {/* Health Certificate Header */}
            <div className="bg-emerald-900 text-white p-6 border-b border-emerald-800 relative">
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-emerald-800/40 border border-emerald-600 rounded px-2 py-0.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase">KFAST VERIFIED</span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <Trees className="h-7 w-7 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight uppercase">ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಪತ್ರ</h3>
                  <h4 className="text-xs text-emerald-100 font-bold uppercase tracking-wider font-mono">Digital Soil Health Certificate</h4>
                </div>
              </div>
              <p className="text-xs text-emerald-200 font-medium">Issued by Karnataka Farmers Association and Smart Technology (KFAST)</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall status banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between shadow-inner ${getStatusColor(result.status)}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧪</span>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest font-bold uppercase opacity-80">Soil Quality Index</span>
                    <h4 className="font-extrabold text-base tracking-tight">{result.status} Fertility State</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono">Date Tested: 2026-05-21</span>
                </div>
              </div>

              {/* Lab Values Grid */}
              <div>
                <h5 className="text-[11px] font-mono tracking-wider font-extrabold text-slate-400 uppercase mb-3">CHEMICAL ANALYSIS VALUES:</h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="border border-slate-150 rounded-xl p-3 text-center bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nitrogen (N)</span>
                    <span className="font-extrabold text-slate-800 text-lg">{inputs.nitrogen}</span>
                    <span className={`block text-[10px] mt-1.5 px-1 bg-white border rounded ${getMetricRatingColor(result.ratings.n)}`}>
                      {result.ratings.n}
                    </span>
                  </div>

                  <div className="border border-slate-150 rounded-xl p-3 text-center bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phosphorus</span>
                    <span className="font-extrabold text-slate-800 text-lg">{inputs.phosphorus}</span>
                    <span className={`block text-[10px] mt-1.5 px-1 bg-white border rounded ${getMetricRatingColor(result.ratings.p)}`}>
                      {result.ratings.p}
                    </span>
                  </div>

                  <div className="border border-slate-150 rounded-xl p-3 text-center bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Potassium (K)</span>
                    <span className="font-extrabold text-slate-800 text-lg">{inputs.potassium}</span>
                    <span className={`block text-[10px] mt-1.5 px-1 bg-white border rounded ${getMetricRatingColor(result.ratings.k)}`}>
                      {result.ratings.k}
                    </span>
                  </div>

                  <div className="border border-slate-150 rounded-xl p-3 text-center bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Soil pH</span>
                    <span className="font-extrabold text-slate-800 text-lg">{inputs.ph}</span>
                    <span className={`block text-[10px] mt-1.5 px-1 bg-white border rounded ${getMetricRatingColor(result.ratings.ph)}`}>
                      {result.ratings.ph}
                    </span>
                  </div>

                  <div className="border border-slate-150 rounded-xl p-3 text-center bg-slate-50 col-span-2 md:col-span-1">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Org. Carbon</span>
                    <span className="font-extrabold text-slate-800 text-lg">{inputs.organicCarbon}%</span>
                    <span className={`block text-[10px] mt-1.5 px-1 bg-white border rounded ${getMetricRatingColor(result.ratings.oc)}`}>
                      {result.ratings.oc}
                    </span>
                  </div>
                </div>
              </div>

              {/* Issues detected */}
              {result.issues.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                  <h5 className="font-bold text-amber-900 text-xs flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Fertility Deficiencies Detected:</span>
                  </h5>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside font-medium leading-relaxed">
                    {result.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Crop Yield Recommendations */}
              <div>
                <h5 className="text-[11px] font-mono tracking-wider font-extrabold text-slate-400 uppercase mb-3 flex items-center space-x-1.5">
                  <FileText className="h-3.5 w-3.5 text-emerald-800" />
                  <span>KFAST Recommended Action Plan:</span>
                </h5>
                <div className="space-y-2.5">
                  {result.recommendations.map((recommendation, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-slate-700 bg-emerald-50/20 px-3 py-2 rounded-xl border border-emerald-500/10">
                      <div className="w-5 h-5 rounded-full bg-emerald-800 text-white shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs leading-relaxed font-semibold">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center bg-slate-50/30">
            <span className="text-4xl mb-3">🧪</span>
            <h4 className="font-bold text-slate-800 text-base">Generate Soil Health Card</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Know your exact soil chemistry parameters. Fill the manual input form on the left or select a quick Karnataka preset to receive digital science recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
