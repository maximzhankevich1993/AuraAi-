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
  const [showResult, setShowResult] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  
  // Новые стейты для управления контентом и оплатой внутри ответа ИИ
  const [userHasPaid, setUserHasPaid] = useState(false);
  const [aiResponse, setAiResponse] = useState({ free: "", premium: "" });

  // Стейт для триггера мистического тумана при переключении вкладок
  const [isSwitching, setIsSwitching] = useState(false);

  const handleTabChange = (tabName) => {
    if (tabName === activeTab) return;
    setIsSwitching(true);
    
    setTimeout(() => {
      setActiveTab(tabName);
      handleReset();
      setTimeout(() => {
        setIsSwitching(false);
      }, 50);
    }, 250);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && activeTab !== "daily-card") return;

    setIsAnalyzing(true);
    setShowResult(false);
    setUserHasPaid(false); // Сбрасываем статус оплаты для нового запроса

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

      const data = await response.json();

      if (data.result) {
        // Бэкенд должен отдавать объект с полями free и premium
        // Если он пока отдает просто строку, мы делим ее программно для теста:
        if (typeof data.result === "string") {
          setAiResponse({
            free: data.result,
            premium: "Оракул зафиксировал в вашей матрице редкий теневой вектор. Ваше подсознание пытается скрыть вытесненный архетип, который полностью раскроет исход вашей ситуации в ближайшие 7 дней. Вектор указывает на скорое столкновение с кармическим уроком."
          });
        } else {
          setAiResponse({
            free: data.result.free || "",
            premium: data.result.premium || ""
          });
        }
        
        setShowResult(true);
        setRefreshHistory((prev) => prev + 1);
      } else {
        alert("Subconscious distortion detected.");
      }
    } catch (error) {
      console.error(error);
      alert("Connection to the Oracle severed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Симуляция успешной крипто-оплаты
  const handlePayment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setUserHasPaid(true); // Открываем скрытую часть текста
    }, 1500);
  };

  const handleReset = () => {
    setInputText("");
    setAiResponse({ free: "", premium: "" });
    setShowResult(false);
    setUserHasPaid(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050508] font-sans antialiased text-slate-200 p-4 md:p-8 overflow-x-hidden">
      
      {/* Фон и Лоадер */}
      <div className="absolute inset-0 z-0">
        <AuraBackground />
      </div>

      {isAnalyzing && (
        <div className="absolute inset-0 z-50 backdrop-blur-2xl bg-black/75 flex items-center justify-center animate-in fade-in duration-300">
          <SmokeLoader />
        </div>
      )}

      {/* Контейнер интерфейса */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center my-auto transition-all duration-700 ease-out">
        
        {/* Шапка Aura AI */}
        {!showResult && !isAnalyzing && (
          <div className="text-center mb-10 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              AURA AI
            </h1>
            <p className="text-[11px] md:text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 font-mono tracking-[0.22em] uppercase mt-3 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
              Where Cybernetics Meets Cosmic Intelligence
            </p>
          </div>
        )}

        {/* ГЛАВНАЯ СТЕНД-КОНСОЛЬ ИНТЕРФЕЙСА */}
        {!showResult && !isAnalyzing && (
          <>
            <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300">
              
              {/* Слой Эффекта Мистического Тумана */}
              <div className={`absolute inset-0 z-30 bg-gradient-to-tr from-purple-500/20 via-indigo-500/10 to-transparent backdrop-blur-md transition-opacity duration-300 pointer-events-none ${isSwitching ? "opacity-100" : "opacity-0"}`} />

              {/* Навигационная Сетка (Табы) */}
              <div className="grid grid-cols-4 gap-1 border-b border-white/5 pb-4 mb-6 text-[11px] font-mono tracking-wider uppercase">
                <button onClick={() => handleTabChange("dream")} className={`py-2 rounded-xl transition-all duration-300 ${activeTab === "dream" ? "text-purple-400 bg-white/[0.04] shadow-[0_0_15px_rgba(168,85,247,0.15)] font-bold" : "text-slate-500 hover:text-slate-300"}`}>🔮 Dream</button>
                <button onClick={() => handleTabChange("tarot")} className={`py-2 rounded-xl transition-all duration-300 ${activeTab === "tarot" ? "text-purple-400 bg-white/[0.04] shadow-[0_0_15px_rgba(168,85,247,0.15)] font-bold" : "text-slate-500 hover:text-slate-300"}`}>🎴 Tarot</button>
                <button onClick={() => handleTabChange("daily-card")} className={`py-2 rounded-xl transition-all duration-300 ${activeTab === "daily-card" ? "text-pink-400 bg-white/[0.04] shadow-[0_0_15px_rgba(244,63,94,0.15)] font-bold" : "text-slate-500 hover:text-slate-300"}`}>☀️ Daily</button>
                <button onClick={() => handleTabChange("journal")} className={`py-2 rounded-xl transition-all duration-300 ${activeTab === "journal" ? "text-indigo-400 bg-white/[0.04] shadow-[0_0_15px_rgba(99,102,241,0.15)] font-bold" : "text-slate-500 hover:text-slate-300"}`}>📖 Journal</button>
              </div>

              {/* Контентные вкладки */}
              <div className="relative min-h-[220px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
                {activeTab === "journal" ? (
                  <div className="min-h-[220px] flex flex-col items-center justify-center text-center p-4">
                    <span className="text-2xl mb-2 animate-pulse">🌙</span>
                    <p className="text-xs font-mono text-indigo-400/70 tracking-widest uppercase mb-1">Lunar Cycle: 24th Day</p>
                    <p className="text-xs text-slate-400 font-light max-w-xs leading-relaxed">Your personal subconscious journal will populate here after database synchronization.</p>
                  </div>
                ) : activeTab === "daily-card" ? (
                  <div className="min-h-[220px] flex flex-col items-center justify-center text-center p-4 bg-black/20 border border-white/5 rounded-2xl">
                    <span className="text-3xl mb-3 animate-bounce duration-[1500ms]">🃏</span>
                    <h3 className="text-xs font-mono text-pink-400/80 tracking-widest uppercase mb-1">The Daily Arcana</h3>
                    <p className="text-[11px] text-slate-400 font-light max-w-xs mb-4 leading-relaxed">Pull your card of the day to evaluate current energetic flows.</p>
                    <button onClick={handleAnalyze} className="px-6 py-2 border border-pink-500/30 hover:border-pink-500 text-pink-400 rounded-xl text-[10px] font-mono uppercase tracking-widest bg-pink-500/5 transition-all shadow-[0_0_15px_rgba(244,63,94,0.05)] hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]">Draw Daily Arcana</button>
                  </div>
                ) : (
                  <div>
                    <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={activeTab === "dream" ? "Describe the plot of your night vision..." : "Formulate your absolute question to the grid..."} className="w-full h-40 bg-black/40 text-slate-100 placeholder-slate-600 border border-white/5 rounded-2xl p-4 text-xs md:text-sm focus:outline-none focus:border-purple-500/40 resize-none transition-all font-light leading-relaxed shadow-inner" />
                    <button onClick={handleAnalyze} disabled={!inputText.trim()} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-slate-100 py-3.5 rounded-2xl text-xs font-mono tracking-[0.2em] uppercase font-semibold disabled:opacity-20 disabled:pointer-events-none transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.25)] active:scale-[0.99]">Pierce the Veil</button>
                  </div>
                )}
              </div>
            </div>

            {activeTab !== "journal" && (
              <div className="w-full mt-6 opacity-80 hover:opacity-100 transition-opacity">
                <ShadowArchive refreshTrigger={refreshHistory} />
              </div>
            )}
          </>
        )}

        {/* ПАНЕЛЬ ВЫВОДА С ПЕЙВОЛЛ-ОБРЫВОМ (ИНТРИГА И БЛЮР) */}
        {showResult && !isAnalyzing && (
          <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.6)] max-h-[78vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. БЕСПЛАТНАЯ ЧАСТЬ ОТВЕТА (Видна ВСЕГДА) */}
            <div className="mb-4">
              <MysticResponse text={aiResponse.free} />
            </div>

            {/* 2. ПРЕМИАЛЬНАЯ ЧАСТЬ ОТВЕТА (Либо открыта, либо под заблюренным замком) */}
            {userHasPaid ? (
              <div className="mt-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl animate-in fade-in duration-500">
                <p className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-2">⚡ Decrypted Core Transmission:</p>
                <MysticResponse text={aiResponse.premium} />
              </div>
            ) : (
              <div className="relative mt-6 p-4 border border-purple-500/20 bg-purple-500/5 rounded-2xl overflow-hidden select-none">
                
                {/* Фейковый заблюренный текст-тизер, создающий визуальный объем */}
                <div className="blur-md pointer-events-none opacity-20 text-xs text-slate-400 leading-relaxed font-light">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cryptographic matrix layer locked. Subconscious shadow vector activated. Your hidden neural path remains sealed under a security key protocol. Realign tokens to read.
                </div>
                
                {/* Кнопка оплаты поверх размытия */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                  <p className="text-[11px] font-mono tracking-widest text-purple-300 uppercase mb-3 text-center px-4">
                    🌌 Reveal Your Hidden Shadow Path
                  </p>
                  <button 
                    onClick={handlePayment}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono px-6 py-3 rounded-xl text-[10px] tracking-widest uppercase font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all duration-300"
                  >
                    Unlock Full Transmission [ 1.00 USDT ]
                  </button>
                </div>

              </div>
            )}

            <ShadowPassport text={aiResponse.free} type={activeTab} />

            <button onClick={handleReset} className="w-full mt-6 border border-white/5 bg-white/[0.01] hover:border-purple-500/30 hover:bg-purple-500/5 text-slate-400 hover:text-purple-300 py-3 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all duration-300">
              Return to Reality
            </button>
          </div>
        )}
      </div>
    </div>
  );
}