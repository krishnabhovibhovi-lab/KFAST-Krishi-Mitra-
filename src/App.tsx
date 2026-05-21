import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Map, 
  Cpu, 
  ChevronRight, 
  Phone, 
  Plus, 
  Heart, 
  Search, 
  CheckCircle, 
  Check,
  AlertTriangle, 
  ShoppingBag, 
  CloudRain, 
  TrendingUp, 
  Send, 
  RefreshCw, 
  HelpCircle, 
  Compass, 
  FileCheck,
  DollarSign, 
  Dribbble, 
  Layers, 
  Truck,
  BookOpen,
  Activity,
  Feather
} from "lucide-react";
import { KrishiAssistant } from "./components/KrishiAssistant";
import { SoilHealthCard } from "./components/SoilHealthCard";
import { KARNATAKA_DISTRICTS, INPUT_CATALOG, INITIAL_IOT_NODES, CORRESPONDING_SUPPORT_CENTRES } from "./data";
import { APMCPriceItem, InputDistributionProduct, IoTSensorNode, DroneBookingOutput, CropInsuranceBooking } from "./types";

export default function App() {
  // Tabs: "dashboard", "assistant", "soil", "inputs", "drone", "insurance", "market"
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Davanagere");
  const [farmerName, setFarmerName] = useState<string>("Mallappa Shidlaghatta");
  const [farmerID, setFarmerID] = useState<string>("KA-45920-B");

  // 1. APMC Live Market State
  const [apmcData, setApmcData] = useState<APMCPriceItem[]>([]);
  const [searchCrop, setSearchCrop] = useState<string>("");
  const [isLoadingAPMC, setIsLoadingAPMC] = useState<boolean>(false);
  const [selectedAPMCCrop, setSelectedAPMCCrop] = useState<APMCPriceItem | null>(null);

  // 2. Direct APMC Selling Form State
  const [sellCrop, setSellCrop] = useState<string>("Maize");
  const [sellWeight, setSellWeight] = useState<string>("45");
  const [sellGrade, setSellGrade] = useState<string>("A");
  const [sellSuccessMsg, setSellSuccessMsg] = useState<string | null>(null);

  // 3. IoT Nodes Vitals & State
  const [iotNodes, setIotNodes] = useState<IoTSensorNode[]>(INITIAL_IOT_NODES);
  const [selectedIoTNode, setSelectedIoTNode] = useState<IoTSensorNode>(INITIAL_IOT_NODES[0]);
  const [isWaterActive, setIsWaterActive] = useState<Record<string, boolean>>({});

  // 4. Quality Input Order State
  const [inputsFilter, setInputsFilter] = useState<string>("All");
  const [inputSearch, setInputSearch] = useState<string>("");
  const [cartProduct, setCartProduct] = useState<InputDistributionProduct | null>(null);
  const [orderedInputs, setOrderedInputs] = useState<Array<{ product: InputDistributionProduct; quantity: number; orderId: string; timestamp: string }>>([
    {
      product: INPUT_CATALOG[1], // High yield Ragi
      quantity: 4,
      orderId: "ORD-98319",
      timestamp: "Today, 08:30 AM"
    }
  ]);
  const [orderQuantity, setOrderQuantity] = useState<number>(2);
  const [orderVillage, setOrderVillage] = useState<string>("Harihara Hobli");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  // 5. Drone Spray Booking State
  const [droneBookings, setDroneBookings] = useState<DroneBookingOutput[]>([
    {
      id: "DRN-8802",
      farmerName: "Mallappa Shidlaghatta",
      phone: "9448102391",
      district: "Davanagere",
      taluk: "Harihara",
      cropType: "Maize (Corn)",
      acreage: 5,
      serviceType: "Spraying (Insecticides/Pesticides)",
      preferredDate: "2026-05-25",
      bookingTime: "Recorded Today 09:12 AM",
      estimatedCost: 1750,
      status: "Confirmed"
    }
  ]);

  const [droneName, setDroneName] = useState<string>("Mallappa Shidlaghatta");
  const [dronePhone, setDronePhone] = useState<string>("9448102391");
  const [droneTaluk, setDroneTaluk] = useState<string>("Harihara");
  const [droneCrop, setDroneCrop] = useState<string>("Maize (Corn)");
  const [droneAcreage, setDroneAcreage] = useState<number>(4);
  const [droneService, setDroneService] = useState<any>("Spraying (Insecticides/Pesticides)");
  const [droneDate, setDroneDate] = useState<string>("2026-05-28");
  const [droneSuccessMsg, setDroneSuccessMsg] = useState<string | null>(null);

  // 6. Crop Insurance State
  const [insurancePolicies, setInsurancePolicies] = useState<CropInsuranceBooking[]>([
    {
      farmerName: "Mallappa Shidlaghatta",
      aadhaar: "5543-9821-3944",
      surveyNumber: "142/A-2",
      crop: "Maize (Mekke Jola)",
      acreage: 5,
      premiumAmount: 430,
      insuredValue: 125000,
      season: "Kharif 2026",
      subidizedPremium: 43
    }
  ]);
  const [insCrop, setInsCrop] = useState<string>("Ragi");
  const [insAadhaar, setInsAadhaar] = useState<string>("");
  const [insSurvey, setInsSurvey] = useState<string>("");
  const [insAcreage, setInsAcreage] = useState<number>(3);
  const [insSuccessMsg, setInsSuccessMsg] = useState<string | null>(null);

  // 7. Interactive Livestock State
  const [livestockList, setLivestockList] = useState([
    { id: "L01", tag: "Cattle #04", breed: "Jersey Cross", type: "Milk Cow", temp: 38.6, status: "Normal", rumination: 38, yield: 14.5, icon: "🐄" },
    { id: "L02", tag: "Cattle #07", breed: "Holstein Friesian", type: "Milk Cow", temp: 39.2, status: "High Temperature", rumination: 26, yield: 18.2, icon: "🐄" },
    { id: "L03", tag: "Cattle #12", breed: "Hallikar Desi", type: "Draught OX", temp: 38.3, status: "Excellent", rumination: 42, yield: 0, icon: "🐂" },
    { id: "L04", tag: "Bovine Elite #22", breed: "Kenguri Breed", type: "Breeding Sheep", temp: 39.0, status: "Active Care", rumination: 35, yield: 0, icon: "🐑" }
  ]);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [milkYieldLog, setMilkYieldLog] = useState<string>("");

  // Drone real-time interactive mapping coordinate mock
  const [droneActiveCoords, setDroneActiveCoords] = useState({ x: 42, y: 55 });
  useEffect(() => {
    const interval = setInterval(() => {
      setDroneActiveCoords(prev => {
        const nextX = prev.x + (Math.random() > 0.5 ? 2 : -2);
        const nextY = prev.y + (Math.random() > 0.5 ? 2 : -2);
        return {
          x: Math.max(10, Math.min(90, nextX)),
          y: Math.max(10, Math.min(90, nextY))
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Soft refresh IoT nodes
  const refreshIoTTelemetry = () => {
    setIotNodes(prev => prev.map(node => ({
      ...node,
      soilMoisture: parseFloat((node.soilMoisture + (Math.random() * 4 - 2)).toFixed(1)),
      temperature: parseFloat((node.temperature + (Math.random() * 0.8 - 0.4)).toFixed(1)),
      lastUpdated: "Just now"
    })));
  };

  // Turn on/off water valves remotely in IoT nodes
  const toggleWaterValve = (nodeId: string) => {
    setIsWaterActive(prev => {
      const state = !prev[nodeId];
      if (state) {
        // Boost soil moisture on frontend instantly
        setIotNodes(nodes => nodes.map(n => {
          if (n.nodeId === nodeId) {
            return {
              ...n,
              soilMoisture: Math.min(95, parseFloat((n.soilMoisture + 15).toFixed(1))),
              lastUpdated: "Valve active"
            };
          }
          return n;
        }));
      }
      return { ...prev, [nodeId]: state };
    });
  };

  // Fetch live Karnataka market rates
  const fetchMarketPrices = async () => {
    setIsLoadingAPMC(true);
    try {
      const response = await fetch(`/api/market-prices?district=${selectedDistrict}&crop=${searchCrop}`);
      if (response.ok) {
        const data = await response.json();
        setApmcData(data);
      }
    } catch (err) {
      console.error("APMC Load Error", err);
    } finally {
      setIsLoadingAPMC(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, [selectedDistrict, searchCrop]);

  const handleSellDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellWeight || parseFloat(sellWeight) <= 0) return;

    const matchedCrop = KarnatakaAPMCDataMock.find(c => c.crop.toLowerCase().includes(sellCrop.toLowerCase())) || { priceMax: 2300 };
    const exactRate = matchedCrop.priceMax;
    const grossPrice = parseFloat(sellWeight) * exactRate;
    
    setSellSuccessMsg(
      `🎉 direct contract initiated! APMC Grade ${sellGrade} confirmed. KFAST logistics will dispatch a truck to your village in district '${selectedDistrict}' for direct pickup. Final Estimated Payout: ₹${grossPrice.toLocaleString()} (Guaranteed better price, no agent commission!).`
    );

    // clear after 10s
    setTimeout(() => {
      setSellSuccessMsg(null);
    }, 10000);
  };

  const handleOrderInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartProduct) return;

    const subsidyPerc = cartProduct.karnatakaSubsidy;
    const priceAfterSubsidy = cartProduct.price * (1 - subsidyPerc / 100);
    const totalCost = Math.round(priceAfterSubsidy * orderQuantity);

    const newOrder = {
      product: cartProduct,
      quantity: orderQuantity,
      orderId: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      timestamp: "Just Now"
    };

    setOrderedInputs(prev => [newOrder, ...prev]);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setCartProduct(null);
    }, 5000);
  };

  const handleBookDrone = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = droneAcreage * 350;

    const newBooking: DroneBookingOutput = {
      id: "DRN-" + Math.floor(1000 + Math.random() * 9000),
      farmerName: droneName,
      phone: dronePhone,
      district: selectedDistrict,
      taluk: droneTaluk,
      cropType: droneCrop,
      acreage: droneAcreage,
      serviceType: droneService,
      preferredDate: droneDate,
      bookingTime: "Recorded Just Now",
      estimatedCost: cost,
      status: "Pending"
    };

    setDroneBookings(prev => [newBooking, ...prev]);
    setDroneSuccessMsg(`🚁 Drone spraying scheduled for ${droneDate}! KFAST Pilot Team will contact you on ${dronePhone} within 4 hours. Estimated cost at subsidized rate: ₹${cost}.`);
    
    setTimeout(() => {
      setDroneSuccessMsg(null);
    }, 8500);

    // Reset simple form fields
    setDroneTaluk("");
    setDroneAcreage(5);
  };

  const handleBookInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insAadhaar || !insSurvey) return;

    let prePerAcre = insCrop === "Ragi" ? 80 : insCrop === "Paddy (Sona Masuri)" ? 150 : 120;
    let sumPerAcre = insCrop === "Ragi" ? 25000 : insCrop === "Paddy (Sona Masuri)" ? 50000 : 38000;

    const finalPremium = Math.round(prePerAcre * insAcreage);
    const finalSum = sumPerAcre * insAcreage;

    const newPolicy: CropInsuranceBooking = {
      farmerName: farmerName,
      aadhaar: insAadhaar,
      surveyNumber: insSurvey,
      crop: insCrop,
      acreage: insAcreage,
      premiumAmount: finalPremium,
      insuredValue: finalSum,
      season: "Kharif 2026",
      subidizedPremium: Math.round(finalPremium * 0.1) // 90% subsidy for Karnataka Small Farmer scheme
    };

    setInsurancePolicies(prev => [newPolicy, ...prev]);
    setInsSuccessMsg(`🛡️ Crop Secured! Policy Generated under PMFBY & Karnataka Parihara scheme. Insured Value: ₹${finalSum.toLocaleString()}. Farmer pays only 10% premium: ₹${newPolicy.subidizedPremium}. Sowing data registered!`);

    setTimeout(() => {
      setInsSuccessMsg(null);
    }, 12000);

    setInsAadhaar("");
    setInsSurvey("");
  };

  const logMilkingRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal || !milkYieldLog) return;

    setLivestockList(prev => prev.map(anim => {
      if (anim.id === selectedAnimal.id) {
        return {
          ...anim,
          yield: parseFloat(milkYieldLog),
          temp: parseFloat((38.5 + Math.random() * 0.4).toFixed(1))
        };
      }
      return anim;
    }));

    // Alert
    alert(`Milk yield of ${milkYieldLog} Liters logged for cow ${selectedAnimal.tag}. Vitals updated automatically.`);
    setSelectedAnimal(null);
    setMilkYieldLog("");
  };

  // Local APMC rates to calculate fallback payouts safely
  const KarnatakaAPMCDataMock = [
    { crop: "Onion", priceMax: 2400 },
    { crop: "Potato", priceMax: 1900 },
    { crop: "Tomato", priceMax: 1700 },
    { crop: "Maize", priceMax: 2320 },
    { crop: "Paddy (Sona Masuri)", priceMax: 2750 },
    { crop: "Byadagi Chilly", priceMax: 25000 },
    { crop: "Cotton", priceMax: 7000 },
    { crop: "Arecanut (Rashi)", priceMax: 48500 },
    { crop: "Ginger", priceMax: 7500 },
    { crop: "Toor Dal (Red Gram)", priceMax: 10200 },
    { crop: "Ragi (Finger Millet)", priceMax: 3600 },
    { crop: "Bengal Gram", priceMax: 6500 }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900 border-t-4 border-emerald-900 leading-normal" id="main_high_density_root">
      
      {/* HEADER SECTION - High Density */}
      <header className="bg-emerald-950 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md border-b border-emerald-800" id="kfast_header">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shadow-lg border border-amber-300">
            <span className="w-9 h-9 bg-emerald-900 rounded-lg flex items-center justify-center font-bold text-white text-xl">K</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight uppercase text-white">
                KFAST <span className="font-light text-amber-300">Krishi Mitra</span>
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                Karnataka State Govt Allied
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 font-medium tracking-wide">
              Empowering farmers through technology & expert advisory for better productivity and higher income
            </p>
          </div>
        </div>

        {/* Farmer Metadata Panel */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="bg-emerald-900/40 border border-emerald-800 p-2.5 rounded-xl">
            <label className="text-[9px] text-emerald-300 font-mono block uppercase">Active Farmer profile</label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-white text-sm">{farmerName}</span>
              <span className="text-[10px] bg-emerald-800 text-amber-200 font-mono px-1.5 py-0.2 rounded font-semibold">
                {farmerID}
              </span>
            </div>
          </div>

          <div className="bg-emerald-950 border border-emerald-800 p-2.5 rounded-xl">
            <label className="text-[9px] text-emerald-300 font-mono block uppercase">KFAST Region Hub</label>
            <select 
              value={selectedDistrict} 
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                // Also trigger APMC load
              }} 
              className="bg-emerald-900 border border-emerald-700 text-white rounded-lg px-2 py-1 mt-0.5 outline-none text-xs font-bold focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {KARNATAKA_DISTRICTS.map((dst) => (
                <option key={dst} value={dst}>{dst}</option>
              ))}
            </select>
          </div>

          <div className="h-10 w-10 bg-gradient-to-br from-emerald-800 to-emerald-700 rounded-full border-2 border-amber-500 flex items-center justify-center font-bold text-white shadow-md">
            KM
          </div>
        </div>
      </header>

      {/* CORE NAVIGATION BAR - Command Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto justify-start py-2.5 space-x-2 scrollbar-none" id="tab_navigation">
          {[
            { id: "dashboard", label: "🏡 Control Center", desc: "Overview & IoT Vitals" },
            { id: "assistant", label: "💬 Personal AI Assistant", desc: "Krishi Mitra Bot" },
            { id: "soil", label: "🧪 Soil Health Lab", desc: "Card Analyzer & Presets" },
            { id: "inputs", label: "📦 Quality Input Store", desc: "Certified Seeds & Subsidy" },
            { id: "drone", label: "🚁 Precision Dro-Sprayer", desc: "Rentals & Sales" },
            { id: "insurance", label: "🛡️ Crop Security & Risk", desc: "PMFBY Insurance" },
            { id: "market", label: "🌾 Market Price Linkage", desc: "Direct APMC Network" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Preload prices if opening market tab
                if (tab.id === "market") {
                  fetchMarketPrices();
                }
              }}
              className={`flex flex-col text-left px-4 py-2 rounded-xl transition-all cursor-pointer border text-nowrap shrink-0 ${
                activeTab === tab.id 
                  ? "bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-800/15" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span className="text-xs font-bold tracking-tight">{tab.label}</span>
              <span className={`text-[9px] mt-0.5 leading-none block font-semibold ${activeTab === tab.id ? "text-emerald-200" : "text-slate-400"}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER AND CONTENT SPACES */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6" id="dashboard_main_canvas">
        
        {/* TAB 1: CONTROL CENTER DASHBOARD (High Density Hybrid Layout) */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="control_center_grid">
            
            {/* COLUMN 1 (Col-span-4): IoT Vitals & Live Telemetry Grid */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-start">
              
              {/* IoT Sensor array */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-800">
                      <Cpu className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">Smart IoT Farm Telemetry</h3>
                  </div>
                  <button 
                    onClick={refreshIoTTelemetry} 
                    className="p-1 px-2.5 bg-slate-150 hover:bg-slate-200 border border-slate-200 font-bold text-[11px] text-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Refresh
                  </button>
                </div>

                <div className="space-y-3.5">
                  {iotNodes.map((node) => (
                    <div 
                      key={node.nodeId}
                      onClick={() => setSelectedIoTNode(node)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedIoTNode.nodeId === node.nodeId 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/10" 
                          : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-[10px] font-mono font-bold ${selectedIoTNode.nodeId === node.nodeId ? "text-amber-300" : "text-emerald-700"}`}>
                          📌 {node.nodeId}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium font-mono">{node.lastUpdated}</span>
                      </div>
                      <p className={`text-xs font-bold leading-tight truncate mb-2 ${selectedIoTNode.nodeId === node.nodeId ? "text-white" : "text-slate-800"}`}>
                        {node.location}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className={`p-1.5 rounded-lg border ${selectedIoTNode.nodeId === node.nodeId ? "bg-slate-800 border-slate-700" : "bg-white border-slate-250"}`}>
                          <span className="text-[9px] block text-slate-400">Soil Moisture</span>
                          <span className="font-bold font-mono">{node.soilMoisture}%</span>
                        </div>
                        <div className={`p-1.5 rounded-lg border ${selectedIoTNode.nodeId === node.nodeId ? "bg-slate-800 border-slate-700" : "bg-white border-slate-250"}`}>
                          <span className="text-[9px] block text-slate-400">Temperature</span>
                          <span className="font-bold font-mono">{node.temperature}°C</span>
                        </div>
                      </div>

                      {/* Micro valv trigger */}
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-mono font-bold">Valve Status</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWaterValve(node.nodeId);
                          }}
                          className={`font-semibold text-[10px] px-2.5 py-1 rounded transition ${
                            isWaterActive[node.nodeId]
                              ? "bg-sky-600 text-white hover:bg-sky-500"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-350"
                          }`}
                        >
                          {isWaterActive[node.nodeId] ? "💧 Sprinkler ON" : "💧 Turn ON"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crop Insurance Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase">Crop Insurance (PMFBY Active)</h3>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">SECURE</span>
                </div>
                <div className="space-y-4">
                  {insurancePolicies.map((p, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-1.5 font-bold text-slate-800">
                        <span>{p.crop}</span>
                        <span className="font-mono text-emerald-800">Insured</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                        <div>Survey No: <span className="font-semibold text-slate-900">{p.surveyNumber}</span></div>
                        <div>Acreage: <span className="font-semibold text-slate-900">{p.acreage} Ac</span></div>
                        <div>Total Coverage: <span className="font-semibold text-slate-900 font-mono">₹{p.insuredValue}</span></div>
                        <div>Season: <span className="font-semibold text-slate-900">{p.season}</span></div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2.5">
                    <CloudRain className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="text-xs font-bold text-blue-900">Mungaru Rainfall Alert</p>
                      <p className="text-[10px] text-blue-800 leading-tight mt-0.5">
                        Moderate-to-heavy showers forecast in {selectedDistrict} next 48 hours. Clear deep trenches around Maize and Paddy crops.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2 (Col-span-5): Precision Map, Telemetry Coordinates & Drone */}
            <div className="lg:col-span-5 space-y-6 flex flex-col">
              
              {/* Live drone map simulator block */}
              <div className="bg-slate-950 rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col text-white min-h-[380px] border border-slate-800 relative">
                {/* Embedded control status overlay */}
                <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-md text-white p-4 rounded-xl border border-white/10 shadow-lg max-w-[280px]">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-300 font-extrabold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Drone active telemetry
                  </p>
                  <h4 className="text-sm font-bold tracking-tight text-white mt-1.5">Model: KFAST Precision D-40</h4>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3 border-t border-white/10 pt-2.5 font-mono text-xs">
                    <div>
                      <p className="text-[9px] text-slate-400">Flight Status</p>
                      <p className="text-emerald-400 font-bold">Spraying Active</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400">Area Coverage</p>
                      <p className="text-amber-300 font-bold">4.2 / 8.5 Acres</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400">Payload Volume</p>
                      <p className="text-slate-300 font-bold">3.2 Litres Left</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400">GPS Coordinates</p>
                      <p className="text-slate-300 font-mono text-[10px]">{droneActiveCoords.x.toFixed(2)}N, {droneActiveCoords.y.toFixed(2)}E</p>
                    </div>
                  </div>
                </div>

                {/* Live canvas mock */}
                <div className="flex-1 bg-emerald-950 p-4 relative flex items-center justify-center select-none overflow-hidden" id="interactive_live_telemetery_map">
                  {/* Grid Lines mockup */}
                  <div className="absolute inset-0 opacity-15" style={{ 
                    backgroundImage: "linear-gradient(to right, #00ff66 1px, transparent 1px), linear-gradient(to bottom, #00ff66 1px, transparent 1px)", 
                    backgroundSize: "32px 32px" 
                  }}></div>

                  {/* Satellite terrain simulation blocks */}
                  <div className="absolute w-[80%] h-[80%] border border-dashed border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-[10px] font-mono text-emerald-400/30 uppercase tracking-widest font-extrabold">Active Mapping Zone • {selectedDistrict} district</span>
                  </div>

                  {/* Dynamic Blinking Drone node */}
                  <div 
                    className="absolute w-8 h-8 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-[10px] shadow-lg shadow-amber-500/30 border border-white transition-all duration-1000 ease-in-out z-20"
                    style={{ left: `${droneActiveCoords.x}%`, top: `${droneActiveCoords.y}%` }}
                    id="blinking_drone_dot"
                  >
                    🚁
                    {/* Ripple radar bounds */}
                    <div className="absolute -inset-2.5 border-2 border-amber-400 rounded-full animate-ping opacity-45"></div>
                  </div>

                  {/* Simulated land plots with color boundaries */}
                  <div className="absolute top-[20%] left-[25%] px-3 py-1.5 border border-emerald-500/40 bg-emerald-900/30 rounded text-[9px] font-mono text-emerald-300">
                    PLOT B (Ragi) - SPRINKLER READY
                  </div>
                  <div className="absolute bottom-[20%] right-[15%] px-3 py-1.5 border border-amber-500/30 bg-amber-900/10 rounded text-[9px] font-mono text-amber-300">
                    PLOT C (Maize) - SPRAY PATTERN #2
                  </div>
                </div>

                {/* Remote drone flight status banner */}
                <div className="bg-slate-900 border-t border-slate-800 p-3 px-4 flex justify-between items-center text-xs text-slate-300">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                    ● Drone spraying results in -70% low water waste and instant precision targeting.
                  </span>
                  <button 
                    onClick={() => setActiveTab("drone")}
                    className="p-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] tracking-wide rounded uppercase cursor-pointer"
                  >
                    Manage Spraying ⚙️
                  </button>
                </div>
              </div>

              {/* Pre & Post-Harvest, APMC Selling Spot */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="p-1 bg-amber-100 text-amber-900 rounded-md">🌾</span>
                    <span>End-to-End Crop Market Linkage</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Harvester to Mandi</span>
                </div>
                
                <p className="text-xs text-slate-600 mb-3.5">
                  Direct farmers linkage network with digital APMCs. Protect your harvested margins from middlemen commissions!
                </p>

                <form onSubmit={handleSellDirect} className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <select 
                        value={sellCrop} 
                        onChange={(e) => setSellCrop(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-700 font-bold"
                      >
                        <option value="Maize">Maize/Jola</option>
                        <option value="Paddy (Sona Masuri)">Sona Masuri Paddy</option>
                        <option value="Byadagi Chilly">Byadagi Chilly</option>
                        <option value="Ragi">Ragi (Finger Millet)</option>
                        <option value="Cotton">Cotton/Arale</option>
                      </select>
                    </div>
                    <div>
                      <input 
                        type="number"
                        placeholder="Quantity in Quintals"
                        value={sellWeight}
                        onChange={(e) => setSellWeight(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-700 font-bold"
                      />
                    </div>
                    <div>
                      <select 
                        value={sellGrade} 
                        onChange={(e) => setSellGrade(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-700 font-bold"
                      >
                        <option value="A">Grade A (Premium)</option>
                        <option value="B">Grade B (Standard)</option>
                        <option value="C">Grade C (Industrial)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs tracking-wider rounded-xl cursor-pointer"
                  >
                    Schedule Direct APMC Pickup Commission-Free
                  </button>
                </form>

                {sellSuccessMsg && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-900 text-xs font-semibold leading-relaxed animate-fade-in text-left">
                    {sellSuccessMsg}
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 3 (Col-span-3): Assistant snapshot & Livestock tracker */}
            <div className="lg:col-span-3 space-y-6 flex flex-col justify-start">
              
              {/* Livestock Monitoring Portal */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>🐄</span>
                    <span>Livestock Health Monitor</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">KFAST Telemetry</span>
                </div>

                <p className="text-xs text-slate-500 mb-3 font-semibold">
                  Real-time IoT temperature and rumination diagnostics. Click animal tag to log milking yields:
                </p>

                <div className="space-y-3.5">
                  {livestockList.map((animal) => (
                    <div 
                      key={animal.id} 
                      onClick={() => {
                        setSelectedAnimal(animal);
                        setMilkYieldLog(animal.yield ? animal.yield.toString() : "");
                      }}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl transition cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-[38px] h-[38px] rounded-lg bg-white border border-slate-150 shadow-sm flex items-center justify-center text-xl">
                        {animal.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-slate-800">{animal.tag}</span>
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-semibold">{animal.breed}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1 text-[10px]">
                          <span className={`${
                            animal.status === "High Temperature" ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"
                          }`}>
                            {animal.status}
                          </span>
                          <span className="font-mono font-medium">{animal.temp}°C</span>
                        </div>

                        {animal.yield > 0 && (
                          <div className="text-[9px] text-blue-600 font-bold mt-1">
                            🥛 Yield: {animal.yield} Litres / Day
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Log modal nested inside for instant interactive response */}
                {selectedAnimal && (
                  <div className="mt-4 p-3 bg-slate-900 rounded-2xl text-white border border-slate-800 text-xs font-sans">
                    <p className="font-bold text-amber-300 mb-2">Log Milking - {selectedAnimal.tag}</p>
                    <form onSubmit={logMilkingRate} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={milkYieldLog}
                          onChange={(e) => setMilkYieldLog(e.target.value)}
                          placeholder="Gallons / Liters"
                          className="flex-1 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs outline-none"
                        />
                        <button type="submit" className="bg-amber-500 text-slate-900 border font-bold px-2.5 py-1 rounded text-xs">
                          Save
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setSelectedAnimal(null)}
                        className="text-[10px] text-slate-400 block underline hover:text-white"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setActiveTab("assistant");
                    // Pass specific contextual instruction
                  }}
                  className="w-full mt-4 py-2 text-xs font-bold border border-slate-205 text-slate-700 hover:bg-slate-50 transition rounded-xl text-center"
                >
                  Request Vet Expert Prescription Call
                </button>
              </div>

              {/* Quick Hub Centre Locator info */}
              <div className="p-4 bg-amber-50 text-slate-800 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase tracking-wide text-[10px] font-mono">
                  <span>🏪</span> Local KFAST Hub
                </div>
                <p className="font-semibold text-slate-850">
                  {CORRESPONDING_SUPPORT_CENTRES[selectedDistrict] || "Karnataka Central KFAST Station, Hubli bypass. Contact: 0836-455201"}
                </p>
                <div className="h-px bg-amber-200/50 my-1"></div>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Dispatched inputs leave directly from this node to guarantee delivery &quoton-time, every-time&quot.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL AI ASSISTANT (Chat with Krishi Mitra bot) */}
        {activeTab === "assistant" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">KFAST AI Farm Advisory Helpdesk</h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
                Your direct 24x7 connection to the Krishi Mitra deep agronomy model. Inputs on crop types, localized treatments, livestock diseases and State subsidies are resolved instantly.
              </p>
            </div>
            
            <KrishiAssistant />
          </div>
        )}

        {/* TAB 3: SOIL HEALTH LAB (Card Analyzer) */}
        {activeTab === "soil" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಪರೀಕ್ಷಾ ಕೇಂದ್ರ</h2>
              <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1">
                Chemical balance analyzer for Karnataka farmers. Ensure balanced Nitrogen (N), Phosphorus (P), and Potassium (K) application to lower your chemical expenses while improving overall productivity.
              </p>
            </div>

            <SoilHealthCard />
          </div>
        )}

        {/* TAB 4: QUALITY INPUT STORE & WAREHOUSE */}
        {activeTab === "inputs" && (
          <div className="space-y-6">
            {/* Header info card */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none transform translate-x-10 -translate-y-10"></div>
              <h2 className="text-xl font-extrabold tracking-tight">Premium Subsidized Input Distribution</h2>
              <p className="text-xs text-emerald-200/80 max-w-2xl mt-1 leading-relaxed">
                Registered Karnataka KFAST small farmers are eligible to purchase certified high-yield seeds and organic bio-pest repellents with up to 60% dynamic State Govt subsidy support. Quality inputs, delivered on-time, every-time!
              </p>
            </div>

            {/* Filter and Shop grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Filter controls left column */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Filter Seed & Nutrient Types</h4>
                  
                  <div className="space-y-1.5">
                    {["All", "Seeds", "Organic Pesticides", "Fertilizers", "Micro-nutrients"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setInputsFilter(cat)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          inputsFilter === cat 
                            ? "bg-emerald-50 text-emerald-900 font-bold" 
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="h-px bg-slate-200 my-4"></div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search inputs Catalog..."
                      value={inputSearch}
                      onChange={(e) => setInputSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                {/* Subsidized Orders logged */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Your Subsidized Orders</h4>
                  <div className="space-y-3">
                    {orderedInputs.map((ord) => (
                      <div key={ord.orderId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-800">{ord.product.name}</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-800">DISPATCHED</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Qty: <span className="font-semibold text-slate-800">{ord.quantity} Bags</span> • Code: <span className="font-mono">{ord.orderId}</span>
                        </div>
                        <p className="text-[10px] text-amber-700 font-semibold mt-1">🚚 ETA: Today via regional KFAST hub</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Store catalog right column */}
              <div className="lg:col-span-9 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {INPUT_CATALOG
                    .filter(item => inputsFilter === "All" || item.category === inputsFilter)
                    .filter(item => item.name.toLowerCase().includes(inputSearch.toLowerCase()))
                    .map((item) => {
                      const finalSubsidyPrice = Math.round(item.price * (1 - item.karnatakaSubsidy / 100));
                      return (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[9px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-250">
                                {item.category}
                              </span>
                              <span className="text-xs text-slate-400 font-mono font-bold">★ {item.rating}</span>
                            </div>
                            
                            <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase">{item.brand}</p>
                            <p className="text-xs text-slate-650 line-clamp-2 leading-relaxed mt-2">{item.description}</p>
                          </div>

                          <div className="border-t border-slate-100 pt-3 mt-4">
                            <div className="flex justify-between items-baseline mb-3">
                              <div>
                                <span className="text-xs text-slate-405 line-through">₹{item.price}</span>
                                <span className="text-base font-extrabold text-slate-900 ml-1.5">₹{finalSubsidyPrice}</span>
                                <span className="text-[10px] text-slate-400 font-mono ml-0.5">/ {item.unit}</span>
                              </div>
                              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                                {item.karnatakaSubsidy}% Govt Subsidy
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setCartProduct(item);
                                setOrderQuantity(2);
                                setOrderSuccess(false);
                              }}
                              className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Request dispatch 📦
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Subsidized Checkout modal block */}
                {cartProduct && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-md">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 mb-2">
                      <span>🏷️</span> Karnataka Small Farmers Subsidy Order Builder
                    </h4>
                    <p className="text-xs text-slate-600 mb-4 font-medium">
                      Configure your KFAST subsidized crop seed pack distribution. This logs against your Farmer ID card.
                    </p>

                    <form onSubmit={handleOrderInput} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest font-extrabold text-slate-400 uppercase mb-1">SELECTED ITEM:</label>
                        <p className="text-xs font-bold text-slate-800 truncate">{cartProduct.name}</p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest font-extrabold text-slate-400 uppercase mb-1">BAG QUANTITY:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          required
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-slate-250 rounded px-2.5 py-1 text-xs text-slate-800 outline-none font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono tracking-widest font-extrabold text-slate-400 uppercase mb-1">TALUK VILLAGE/HOBLI:</label>
                        <input
                          type="text"
                          required
                          value={orderVillage}
                          onChange={(e) => setOrderVillage(e.target.value)}
                          placeholder="Harihara hobli"
                          className="w-full bg-white border border-slate-250 rounded px-2.5 py-1 text-xs text-slate-800 outline-none font-bold"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-emerald-850 hover:bg-emerald-800 text-white font-extrabold text-xs rounded transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          Confirm & Pay Subsidized Rate
                        </button>
                      </div>
                    </form>

                    {orderSuccess && (
                      <div className="mt-3.5 p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-900 text-xs font-extrabold rounded-xl flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-800" />
                        <span>Certified Input order logged successfully! ETA via KFAST local support centre: TODAY. Deliver on time, every time is active.</span>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* TAB 5: DRONE SALES & SPRAYING SERVICES */}
        {activeTab === "drone" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="drone_rentals_space">
            
            {/* Form & Specs left column (Col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <span>🛰️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Book Subsidized Spraying Drone</h3>
                    <p className="text-xs text-slate-500 font-medium">Precision spraying over custom acres</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs mb-5 font-semibold">
                  🌿 <strong>Subsidized Rate:</strong> Fixed at <strong>₹350 per acre</strong> including pesticide/liquid-nutrient dispersal support. Covers up to 10 acres per farmer!
                </div>

                <form onSubmit={handleBookDrone} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Full Name:</label>
                    <input
                      type="text"
                      required
                      value={droneName}
                      onChange={(e) => setDroneName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone:</label>
                      <input
                        type="tel"
                        required
                        value={dronePhone}
                        onChange={(e) => setDronePhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Taluk:</label>
                      <input
                        type="text"
                        required
                        placeholder="Harihara"
                        value={droneTaluk}
                        onChange={(e) => setDroneTaluk(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Active Sowing Crop:</label>
                      <input
                        type="text"
                        required
                        value={droneCrop}
                        onChange={(e) => setDroneCrop(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sowing Acreage:</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        required
                        value={droneAcreage}
                        onChange={(e) => setDroneAcreage(parseFloat(e.target.value) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Precision Service Type:</label>
                    <select
                      value={droneService}
                      onChange={(e) => setDroneService(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-semibold"
                    >
                      <option value="Spraying (Insecticides/Pesticides)">Spraying (Insecticides/Pesticides)</option>
                      <option value="Nutrient Spraying">Nutrient Foliar Spraying</option>
                      <option value="Crop Health Mapping">Crop Health Hyperspectral Mapping</option>
                      <option value="Purchase Demonstration">Drone Purchase & Farmer Certification Demonstration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Launch Date:</label>
                    <input
                      type="date"
                      required
                      value={droneDate}
                      onChange={(e) => setDroneDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  {/* Calculated cost feedback */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-bold">Estimated Cost (Subsidized):</span>
                    <span className="text-base font-extrabold text-emerald-800 font-mono">₹{droneAcreage * 350}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-850 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow transition tracking-wider cursor-pointer uppercase text-xs"
                  >
                    Confirm Aerial Drone Spray Booking 🚁
                  </button>
                </form>

                {droneSuccessMsg && (
                  <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-900 text-xs font-extrabold rounded-xl leading-relaxed text-left animate-fade-in">
                    {droneSuccessMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Bookings log and Spec breakdown right column (Col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Drone Specs card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-lg tracking-tight">KFAST drone sales certified</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Agricultural Drone Infrastructure - Model D-40 Sprayer</p>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded font-mono uppercase">
                    DGCA Certified
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-xl mb-4">
                  Interested in purchasing a heavy-duty crop sprayer? KFAST provides training, licensing and structured bank finance with up to 50% central subsidy for rural youth under SMAM scheme.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-mono">
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                    <span className="block text-[9px] text-slate-400 font-medium">Chemical Tank</span>
                    <span className="font-extrabold text-white text-sm mt-1 block">16 Litres</span>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                    <span className="block text-[9px] text-slate-400 font-medium">Lithium Smart Batt</span>
                    <span className="font-extrabold text-white text-sm mt-1 block">35 min duration</span>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                    <span className="block text-[9px] text-slate-400 font-medium">Coverage Speed</span>
                    <span className="font-extrabold text-white text-sm mt-1 block">1 Acre / 6 Mins</span>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                    <span className="block text-[9px] text-slate-400 font-medium">Radar Antennas</span>
                    <span className="font-extrabold text-white text-sm mt-1 block">Terrain Following</span>
                  </div>
                </div>
              </div>

              {/* Current booked slots queue */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm mb-3">Drone spraying booking history</h4>
                <div className="space-y-3.5">
                  {droneBookings.map((b) => (
                    <div key={b.id} className="p-4 bg-slate-50 border border-slate-205 rounded-xl text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-800 text-sm">{b.serviceType}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono tracking-wider ${
                          b.status === "Confirmed" 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-150" 
                            : "bg-amber-50 text-amber-800 border border-amber-150 animate-pulse"
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-500 text-[11px] font-sans">
                        <div>Sowing: <strong className="text-slate-800">{b.cropType}</strong></div>
                        <div>Acreage: <strong className="text-slate-800">{b.acreage} Acres</strong></div>
                        <div>Date Sched: <strong className="text-slate-800 font-mono">{b.preferredDate}</strong></div>
                        <div>Cost Quote: <strong className="text-emerald-800 font-mono">₹{b.estimatedCost}</strong></div>
                      </div>

                      <div className="text-[10px] text-slate-400 mt-2 border-t border-slate-200/50 pt-1.5 flex justify-between">
                        <span>Launch ID: <strong className="font-mono">{b.id}</strong></span>
                        <span>Location: <strong className="font-medium">{b.taluk} Taluk, {b.district}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: CROP INSURANCE & RISK MITIGATION */}
        {activeTab === "insurance" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="ins_space">
            
            {/* Input insurance registration (Col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <span>🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">PM-Fasal Bima Yojana Registration</h3>
                    <p className="text-xs text-slate-500 font-medium">Protect harvested capital from extreme weather risks</p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 text-xs mb-5 font-semibold leading-relaxed">
                  🛡️ <strong>Karnataka Parihara & PMFBY Scheme:</strong> Subsidy up to 90% on insurance premium under central core agricultural welfare directives.
                </div>

                <form onSubmit={handleBookInsurance} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Aadhaar Identity Number (12 digit):</label>
                    <input
                      type="text"
                      required
                      placeholder="5543-9821-3944"
                      value={insAadhaar}
                      onChange={(e) => setInsAadhaar(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Land Survey No (RTC):</label>
                      <input
                        type="text"
                        required
                        placeholder="142/A-2"
                        value={insSurvey}
                        onChange={(e) => setInsSurvey(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Crop Sowed:</label>
                      <select
                        value={insCrop}
                        onChange={(e) => setInsCrop(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-bold cursor-pointer"
                      >
                        <option value="Ragi">Ragi (Finger Millet)</option>
                        <option value="Paddy (Sona Masuri)">Sona Masuri Paddy</option>
                        <option value="Maize">Maize/Jola</option>
                        <option value="Arecanut">Arecanut</option>
                        <option value="Toor Dal">Toor Dal/Gram</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Insured Acreage:</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={insAcreage}
                      onChange={(e) => setInsAcreage(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-bold animate-pulse"
                    />
                  </div>

                  {/* Pricing logic block */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 font-medium text-slate-700">
                    <div className="flex justify-between">
                      <span>Total Sum Insured Coverage:</span>
                      <strong className="text-slate-900 font-mono">₹{(insCrop === "Ragi" ? 25000 : insCrop === "Paddy (Sona Masuri)" ? 50000 : 38000) * insAcreage}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Standard Premium:</span>
                      <strong className="text-slate-905 font-mono line-through">₹{(insCrop === "Ragi" ? 80 : insCrop === "Paddy (Sona Masuri)" ? 150 : 120) * insAcreage}</strong>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span>Farmer Subsidized Premium (Pays Only 10%):</span>
                      <span className="font-mono">₹{Math.round(((insCrop === "Ragi" ? 80 : insCrop === "Paddy (Sona Masuri)" ? 150 : 120) * insAcreage) * 0.1)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-850 hover:bg-emerald-800 text-white font-extrabold rounded-xl transition tracking-wider uppercase text-xs"
                  >
                    Secure Sowing Area Instantly 🛡️
                  </button>
                </form>

                {insSuccessMsg && (
                  <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-900 text-xs font-bold rounded-xl leading-relaxed text-left animate-fade-in">
                    {insSuccessMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Insurance details layout (Col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Your Secured Crop Land Records</h3>
                
                <div className="space-y-4">
                  {insurancePolicies.map((pol, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-205 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{pol.crop} (Sowing Protected Code)</h4>
                          <span className="text-[10px] text-slate-400 font-mono">Season: {pol.season}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] text-emerald-800 font-extrabold uppercase bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded font-mono">
                            Active Protection Plan
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-3 bg-white p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">LAND SURVEY ID</span>
                          <span className="font-bold text-slate-800">{pol.surveyNumber}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">INSURED COVERAGE</span>
                          <span className="font-bold text-slate-800 font-mono">₹{pol.insuredValue}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">EST PREMIUM</span>
                          <span className="font-bold text-slate-900 line-through">₹{pol.premiumAmount}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">farmer cost</span>
                          <span className="font-bold text-emerald-700 font-mono">₹{pol.subidizedPremium}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather and advice metrics box */}
              <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-2xl relative overflow-hidden">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <CloudRain className="h-5 w-5 text-amber-300 shrink-0" />
                  <span>Stay One Step Ahead of Extreme Risks</span>
                </h4>
                <p className="text-xs text-emerald-100 opacity-90 leading-relaxed">
                  KFAST integrates satellite weather radar monitoring. If drought indicators or heavy unseasonal rain clusters are picked up over your specific survey coordinates, warnings are automatically sent out with structural agronomy advice to defend your yield margins in real-time.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 7: APMC PRICES & DIRECT MARKET LINKAGES */}
        {activeTab === "market" && (
          <div className="space-y-6">
            
            {/* Search form bar and filter */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">Karnataka APMC Crop Price Index</h3>
                <p className="text-xs text-slate-500 mt-0.5">District wise real-time average rates of key crops</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search crop in Mandi..."
                    value={searchCrop}
                    onChange={(e) => setSearchCrop(e.target.value)}
                    className="bg-slate-50 border border-slate-250 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <button 
                  onClick={fetchMarketPrices}
                  className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border-slate-800 cursor-pointer"
                >
                  Reload Live Prices
                </button>
              </div>
            </div>

            {/* Price list and details panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Live list of APMC prices */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                
                {isLoadingAPMC ? (
                  <div className="p-12 text-center text-xs text-slate-500 font-bold space-y-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-emerald-800 mx-auto" />
                    <span>Accessing state APMC directories...</span>
                  </div>
                ) : apmcData.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500 font-bold">
                    😔 No active price points records found for search criteria. Change filter district or crop.
                  </div>
                ) : (
                  <table className="w-full text-xs text-left" id="apmc_table_dataset">
                    <thead className="bg-slate-50 text-slate-400 font-mono tracking-wider font-extrabold text-[11px] uppercase border-b border-slate-150">
                      <tr>
                        <th className="p-4">Crop Name</th>
                        <th className="p-4">APMC Market location</th>
                        <th className="p-4 text-right">Daily low price</th>
                        <th className="p-4 text-right">Daily peak price</th>
                        <th className="p-4 text-center">Price trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {apmcData.map((item) => (
                        <tr 
                          key={item.id} 
                          onClick={() => setSelectedAPMCCrop(item)}
                          className="hover:bg-emerald-50/20 cursor-pointer transition"
                        >
                          <td className="p-4 font-bold text-slate-800">{item.crop}</td>
                          <td className="p-4">
                            <span className="block font-semibold text-slate-700">{item.market}</span>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">{item.district} District</span>
                          </td>
                          <td className="p-4 text-right font-mono text-slate-500">₹{item.priceMin.toLocaleString()} / qtl</td>
                          <td className="p-4 text-right font-mono font-bold text-slate-900">₹{item.priceMax.toLocaleString()} / qtl</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              item.priceTrend === "UP" 
                                ? "bg-emerald-50 text-emerald-800"
                                : item.priceTrend === "DOWN" 
                                  ? "bg-rose-50 text-rose-800" 
                                  : "bg-slate-100 text-slate-850"
                            }`}>
                              {item.priceTrend === "UP" ? "▲ UP" : item.priceTrend === "DOWN" ? "▼ DOWN" : "● UNCHANGED"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* District Linkages and direct sales info right column */}
              <div className="lg:col-span-4 space-y-6">
                
                {selectedAPMCCrop ? (
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-amber-300 text-sm">Selected Crop Price Analytics</h4>
                      <button 
                        onClick={() => setSelectedAPMCCrop(null)}
                        className="text-xs text-slate-400 block underline uppercase hover:text-white"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <p className="text-xl font-extrabold text-white tracking-tight mb-1">{selectedAPMCCrop.crop}</p>
                    <p className="text-xs text-slate-400 mb-4">{selectedAPMCCrop.market} APMC centre</p>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex justify-between items-center bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span>Min Sowing Price:</span>
                        <strong className="font-mono text-white">₹{selectedAPMCCrop.priceMin} / qtl</strong>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span>Peak Mandi Price:</span>
                        <strong className="font-mono text-amber-300">₹{selectedAPMCCrop.priceMax} / qtl</strong>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                        <span>Est Daily Market Arrival:</span>
                        <strong className="font-semibold text-white">{selectedAPMCCrop.arrival}</strong>
                      </div>
                    </div>

                    <div className="mt-5 p-3.5 bg-emerald-900/40 border border-emerald-500/10 rounded-xl">
                      <p className="text-[10px] text-amber-400 font-mono font-extrabold block mb-1 uppercase text-left">ESTIMATED PROFIT ADVISORY:</p>
                      <p className="text-xs leading-relaxed text-slate-200">
                        The current trend for {selectedAPMCCrop.crop} in {selectedAPMCCrop.district} is registered as <strong>{selectedAPMCCrop.priceTrend}</strong>. Sowing or releasing stored grain now offers optimal return value. Apply via Krishi assistant for direct pickup.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-205 bg-slate-50 p-5 rounded-2xl text-center text-xs text-slate-500">
                    <p className="font-bold text-slate-700">Crop Price Inspector</p>
                    <p className="mt-1 leading-relaxed">
                      Click any active row in the Karnataka APMC price grid on the left to pull specific details, daily arrivals, and historical KFAST marketing advice.
                    </p>
                  </div>
                )}

                {/* Sell link banner static */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Post-Harvest Linkages</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    KFAST holds regular village procurement centers throughout the year. We buy crop loads under guaranteed minimum support price (MSP) values to eliminate dry warehouse and storage damage.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg text-[11px] leading-tight text-slate-500 border border-slate-100">
                    🗣️ <strong>Call Karnataka toll free:</strong> 1800-425-1555 to request transport vehicle arrival at your coordinate village.
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER SECTION - High Density Style Guide */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 mt-12 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500" id="kfast_footer_center">
        <div className="flex flex-col sm:flex-row gap-4 mb-3 sm:mb-0 text-center sm:text-left">
          <span>&copy; 2026 KFAST Karnataka Farmers Association and Smart Technology</span>
          <span className="hidden sm:inline text-slate-200">|</span>
          <span>Integrated Agri-Livestock Digital Network (v3.5.4)</span>
          <span className="hidden sm:inline text-slate-200">|</span>
          <span className="font-mono text-[10px]">Portal: Live on {selectedDistrict} Hub Node</span>
        </div>
        <div className="flex gap-4 font-bold">
          <span className="text-emerald-700 animate-pulse flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            SYSTEM ONLINE
          </span>
          <span className="text-slate-400 font-mono tracking-tight text-[10px]">
            SATELLITE SYNC: ACTIVE (REFRESHED {new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})})
          </span>
        </div>
      </footer>

    </div>
  );
}
