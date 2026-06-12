"use client";
import { useState } from "react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";
import MysticResponse from "../components/MysticResponse";
import ShadowPassport from "../components/ShadowPassport";
import ShadowArchive from "../components/ShadowArchive";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dream"); // dream, tarot, daily-card, journal
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim() && activeTab !== "daily-card") return;

    setIsAnalyzing(true);
    setShowResult(false);
    setIsPaywallOpen(false);

    let sessionId = localStorage.getItem("aura_session_id");
    if (!sessionId) {
      sessionId = "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("aura_session_id", sessionId);
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, type: activeTab, sessionId }), 
      });

      if (response.status === 403) {
        const errData = await response.json();
        if (errData.error === "OUT_OF_CREDITS") {
          setIsPaywallOpen(true);
          setIsAnalyzing(false);
          return;
        }
      }

      const data = await response.json();

      if (data.result) {
        setAiResponse(data.result);
        setShowResult(true);
        setRefreshHistory((prev) => prev + 1);
      } else {
        alert("Subconscious distortion detected. The Oracle could not decode the transmission.");
      }
    } catch (error) {
      console.error(error);
      alert("Connection to the Oracle severed. Check your network matrix.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setAiResponse("");
    setShowResult(false);
    setIsPaywallOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050508] font-sans antialiased text-slate-200 p-4 md:p-8 overflow-x-hidden">
      
      {/* 1. Dynamic Neo-Background Layer */}
      <div className="absolute inset-0 z-0">
        <AuraBackground />
      </div>

      {/* 2. Loader Overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-50 backdrop-blur-md bg-black/40 flex items-center justify-center">
          <SmokeLoader />
        </div>
      )}

      {/* 3. Main Centered UI Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center my-auto transition-all duration-700 ease-out">
        
        {/* Header Block with Cyber-Mystic Slogan */}
        {!showResult && !isAnalyzing && (
          <div className="text-center mb-10 select-none pointer-events-none">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              AURA AI
            </h1>
            <p className="text-[11px] md:text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 font-mono tracking-[0.22em] uppercase mt-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              Where Cybernetics Meets Cosmic Intelligence
            </p>
          </div>
        )}

        {/* PAYWALL SCREEN */}
        {isPaywallOpen && (
          <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-in fade-in zoom-in-95 duration-300">
            <span className="text-4xl mb-4 block animate-bounce text-purple-400">⚡</span>
            <h2 className="text-lg font-semibold tracking-wider text-slate-100 uppercase mb-2">Energy Core Depleted</h2>
            <p className="text-xs text-slate-400 font-light max-w-sm mx-auto mb-6 leading-relaxed">
              Your free submersions have faded. Realign the transmission matrix with the Oracle via a security token core.
            </p>
            <div className="bg-black/40 p-4 border border-white/5 rounded-2xl mb-6 max-w-xs mx-auto backdrop-blur-md">
              <span className="text-[10px] text-slate-500 font-mono block mb-1 tracking-widest">TRANSMISSION RECHARGE</span>
              <span className="text-xl text-purple-400 font-bold font-mono">5 Sessions = 2.00 USDT</span>
            </div>
            <button 
              onClick={() => alert("Crypto integration unlocks post-deployment.")}
              className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono py-3.5 rounded-xl text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95"
            >
              [ Activate via CryptoCloud ]
            </button>
            <button 
              onClick={handleReset}
              className="block mx-auto mt-5 text-[10px] text-slate-500 hover:text-purple-400 font-mono uppercase tracking-widest transition-colors"
            >
              ← Re-enter Void
            </button>
          </div>
        )}

        {/* MAIN INTERFACE CONSOLE */}
        {!showResult && !isAnalyzing && !isPaywallOpen && (
          <>
            <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-300">
              
              {/* Premium Tab Bar Navigation */}
              <div className="grid grid-cols-4 gap-1 border-b border-white/5 pb-4 mb-6 text-[11px] font-mono tracking-wider uppercase select-none">
                <button
                  onClick={() => { setActiveTab("dream"); handleReset(); }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === "dream" ? "text-purple-400 bg-white/[0.04] shadow-[0_0_15px_rgba(168,85,247,0.1)] font-bold" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  🔮 Dream
                </button>
                <button
                  onClick={() => { setActiveTab("tarot"); handleReset(); }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === "tarot" ? "text-purple-400 bg-white/[0.04] shadow-[0_0_15px_rgba(168,85,247,0.1)] font-bold" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  🎴 Tarot
                </button>
                <button
                  onClick={() => { setActiveTab("daily-card"); handleReset(); }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === "daily-card" ? "text-pink-400 bg-white/[0.04] shadow-[0_0_15px_rgba(244,63,94,0.1)] font-bold" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  ☀️ Daily
                </button>
                <button
                  onClick={() => { setActiveTab("journal"); }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === "journal" ? "text-indigo-400 bg-white/[0.04] shadow-[0_0_15px_rgba(99,102,241,0.1)] font-bold" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  📖 Journal
                </button>
              </div>

              {/* Conditional Renderer based on Tabs */}
              {activeTab === "journal" ? (
                <div className="min-h-[160px] flex flex-col items-center justify-center text-center p-4">
                  <span className="text-2xl mb-2 animate-pulse">🌙</span>
                  <p className="text-xs font-mono text-indigo-400/70 tracking-widest uppercase mb-1">Lunar Cycle: 24th Day</p>
                  <p className="text-xs text-slate-400 font-light max-w-xs leading-relaxed">Your personal subconscious journal will populate here after database synchronization.</p>
                </div>
              ) : activeTab === "daily-card" ? (
                <div className="min-h-[160px] flex flex-col items-center justify-center text-center p-4 bg-black/20 border border-white/5 rounded-2xl">
                  <span className="text-3xl mb-3 animate-bounce duration-1000">🃏</span>
                  <h3 className="text-xs font-mono text-pink-400/80 tracking-widest uppercase mb-1">The Daily Arcana</h3>
                  <p className="text-[11px] text-slate-400 font-light max-w-xs mb-4 leading-relaxed">Pull your card of the day to evaluate current energetic flows.</p>
                  <button
                    onClick={handleAnalyze}
                    className="px-6 py-2 border border-pink-500/30 hover:border-pink-500 text-pink-400 rounded-xl text-[10px] font-mono uppercase tracking-widest bg-pink-500/5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.05)] hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    Draw Daily Arcana
                  </button>
                </div>
              ) : (
                <>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      activeTab === "dream"
                        ? "Describe the plot of your night vision, key imagery, and inner sensations..."
                        : "Formulate your absolute question to the grid. What troubles your current mental plane?..."
                    }
                    className="w-full h-40 bg-black/40 text-slate-100 placeholder-slate-600 border border-white/5 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 resize-none transition-all font-light leading-relaxed shadow-inner"
                  />

                  <button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim()}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-slate-100 py-3.5 rounded-2xl text-xs font-mono tracking-[0.2em] uppercase font-semibold disabled:opacity-20 disabled:pointer-events-none transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.25)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.4)] active:scale-[0.99]"
                  >
                    Pierce the Veil
                  </button>
                </>
              )}
            </div>

            {/* Archive History Component Feed */}
            {activeTab !== "journal" && (
              <div className="w-full mt-6 opacity-80 hover:opacity-100 transition-opacity">
                <ShadowArchive refreshTrigger={refreshHistory} />
              </div>
            )}
          </>
        )}

        {/* AI OUTPUT RESPONSE PANEL */}
        {showResult && !isAnalyzing && (
          <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] max-h-[78vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MysticResponse text={aiResponse} />
            <ShadowPassport text={aiResponse} type={activeTab} />

            <button
              onClick={handleReset}
              className="w-full mt-8 border border-white/5 bg-white/[0.01] hover:border-purple-500/30 hover:bg-purple-500/5 text-slate-400 hover:text-purple-300 py-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300"
            >
              Return to Reality
            </button>
          </div>
        )}
      </div>
    </div>
  );
}