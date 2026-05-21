import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

export function KrishiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! 🙏 Welcome to KFAST Krishi Mitra AI Help. I am your personal farm scientist and advisor.\n\nAsk me anything about crop diseases, fertilizers, government schemes (like Krishi Bhagya, Ganga Kalyana), sowing times, or livestock care in Karnataka!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [district, setDistrict] = useState("Davanagere");
  const [primaryCrop, setPrimaryCrop] = useState("Maize");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const templates = [
    { label: "Arecanut Rot Disease Treat", text: "How to cure Arecanut (Adike) tender nut rotting (Kole Roga) disease in Shivamogga district?" },
    { label: "Ganga Kalyana Scheme Details", text: "What is the eligibility of Ganga Kalyana Borewell scheme in Karnataka? How to apply?" },
    { label: "Paddy Nutrient Management", text: "Recommend a fertilizer schedule for Sona Masuri Paddy in Davanagere under channel water irrigation." },
    { label: "Sheep Health & Blue Tongue", text: "What are the common symptoms of blue tongue disease in cattle/sheep and what is the vaccination timing?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          context: {
            district,
            crop: primaryCrop
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact advisor node");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "😔 Deeply apologize, KFAST main server is currently busy. Please double check that GEMINI_API_KEY is active in Settings, or contact our toll-free support cell: 1800-425-1555.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (text: string) => {
    setInputMessage(text);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden h-[620px] flex flex-col" id="krishi_assistant_container">
      {/* Bot Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-600 px-6 py-4 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base">
              Krishi Mitra AI Assistant
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono font-medium tracking-widest uppercase shadow-sm">INTEGRATED</span>
            </h3>
            <p className="text-xs text-emerald-100 font-medium">KFAST Rythu Support Advisor (Karnataka Specialist)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex flex-col text-right">
            <label className="text-[9px] text-emerald-200 uppercase font-mono tracking-wider">Context Location</label>
            <select 
              value={district} 
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-emerald-900/60 text-white text-xs border border-emerald-600 rounded px-1.5 py-0.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="Davanagere">Davanagere</option>
              <option value="Shivamogga">Shivamogga</option>
              <option value="Dharwad">Dharwad (Hubli)</option>
              <option value="Kalaburagi">Kalaburagi</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Kolar">Kolar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-emerald-50/20 to-white space-y-4 font-sans text-sm">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}>
            {m.sender === "bot" && (
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shrink-0 font-bold shadow">
                KM
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-3 rounded-2xl shadow-sm ${
              m.sender === "user" 
                ? "bg-emerald-800 text-white rounded-br-none" 
                : m.text.includes("Local Backup") 
                  ? "bg-amber-50 text-slate-800 border-l-4 border-amber-500 rounded-bl-none"
                  : "bg-slate-100 text-slate-800 rounded-bl-none text-left"
            }`}>
              <div className="leading-relaxed whitespace-pre-line prose prose-sm max-w-none text-left">
                {m.text}
              </div>
              <span className={`block text-[10px] mt-1 text-right ${m.sender === "user" ? "text-emerald-200" : "text-slate-400"}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs animate-pulse">
              KM
            </div>
            <div className="bg-slate-50 border border-slate-100 text-slate-600 px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-2.5">
              <RefreshCw className="h-4 w-4 text-emerald-600 animate-spin" />
              <span className="font-medium text-xs tracking-wide">Krishi Mitra AI is thinking / ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Templates Row */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
        <label className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 block mb-1 uppercase">Recommended Karnataka Questions:</label>
        <div className="flex space-x-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
          {templates.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleTemplateClick(t.text)}
              className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-slate-600 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 shadow-sm"
            >
              💡 {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="p-4 border-t border-slate-100 bg-white flex items-center space-x-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about crops, soils, fertilizers or livestock in Kannada/English..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-800 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="bg-emerald-800 text-white p-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-40 disabled:hover:bg-emerald-800 shadow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
