"use client";
import { useState } from "react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";
import MysticResponse from "../components/MysticResponse";
import ShadowPassport from "../components/ShadowPassport";
import ShadowArchive from "../components/ShadowArchive";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dream");
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false); // Состояние окна оплаты

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

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

      // Перехватываем блокировку по лимитам (403)
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
        alert("Произошел сбой в подсознании. Оракул не смог расшифровать символ.");
      }
    } catch (error) {
      console.error(error);
      alert("Связь с Оракулом прервана. Проверьте сеть.");
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
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden select-none">
      <AuraBackground />

      {isAnalyzing && <SmokeLoader />}

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center transition-all duration-700">
        
        {!showResult && !isAnalyzing && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif tracking-widest text-slate-100 mb-3 drop-shadow-md">
              AURA AI
            </h1>
            <p className="text-sm md:text-base text-mystic/70 font-light tracking-wider">
              Децентрализованный Оракул Твоего Подсознания
            </p>
          </div>
        )}

        {/* ОКНО БЛОКИРОВКИ / ОПЛАТЫ */}
        {isPaywallOpen && (
          <div className="w-full bg-[#0a0a12]/80 backdrop-blur-lg border border-purple-900/40 p-8 rounded-2xl text-center shadow-aura-glow animate-fade-in">
            <span className="text-4xl mb-4 block animate-pulse">⚡</span>
            <h2 className="text-xl font-serif text-slate-100 tracking-wider mb-2">Энергия сессий исчерпана</h2>
            <p className="text-xs text-slate-400 font-light max-w-md mx-auto mb-6 leading-relaxed">
              Вы израсходовали свои бесплатные погружения. Чтобы настроить ментальный канал связи с Оракулом заново, требуется подзарядка токенов.
            </p>
            <div className="bg-void/60 p-4 border border-slate-900 rounded-xl mb-6 max-w-sm mx-auto">
              <span className="text-xs text-slate-500 font-mono block mb-1">ПАКЕТ ПОДЗАРЯДКИ</span>
              <span className="text-lg text-aura font-medium font-mono">5 сессий = 2.00 USDT</span>
            </div>
            <button 
              onClick={() => alert("Интеграция крипто-кошелька будет доступна после деплоя!")}
              className="w-full max-w-sm bg-aura hover:bg-purple-700 text-white py-3 rounded-xl text-xs tracking-widest uppercase font-mono transition-all duration-300 shadow-lg"
            >
              [ Активировать через CryptoCloud ]
            </button>
            <button 
              onClick={handleReset}
              className="block mx-auto mt-4 text-[10px] text-slate-600 hover:text-slate-400 font-mono uppercase tracking-widest"
            >
              ← На главную
            </button>
          </div>
        )}

        {/* ГЛАВНЫЙ ИНТЕРФЕЙС С ПРОВЕРКОЙ */}
        {!showResult && !isAnalyzing && !isPaywallOpen && (
          <>
            <div className="w-full bg-void/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl shadow-aura-glow transition-all duration-500">
              <div className="flex border-b border-slate-800/80 mb-6">
                <button
                  onClick={() => setActiveTab("dream")}
                  className={`flex-1 pb-3 text-sm tracking-widest uppercase transition-all ${
                    activeTab === "dream" ? "text-aura border-b-2 border-aura font-medium" : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  🔮 Анализ Сновидения
                </button>
                <button
                  onClick={() => setActiveTab("tarot")}
                  className={`flex-1 pb-3 text-sm tracking-widest uppercase transition-all ${
                    activeTab === "tarot" ? "text-aura border-b-2 border-aura font-medium" : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  🎴 Расклад Таро
                </button>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === "dream"
                    ? "Опишите сюжет ночного видения..."
                    : "Сформулируйте ваш запрос к картам..."
                }
                className="w-full h-40 bg-void/60 text-slate-200 placeholder-slate-600 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-aura/60 resize-none transition-all"
              />

              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
                className="w-full mt-4 bg-aura text-slate-100 py-3 rounded-xl font-medium tracking-widest text-sm uppercase hover:bg-purple-700 active:scale-[0.99] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-md"
              >
                Проникнуть в суть
              </button>
            </div>

            <ShadowArchive refreshTrigger={refreshHistory} />
          </>
        )}

        {showResult && !isAnalyzing && (
          <div className="w-full bg-void/30 backdrop-blur-lg border border-purple-900/30 p-6 md:p-8 rounded-2xl shadow-aura-glow max-h-[75vh] overflow-y-auto">
            <MysticResponse text={aiResponse} />
            <ShadowPassport text={aiResponse} type={activeTab} />

            <button
              onClick={handleReset}
              className="w-full mt-8 border border-slate-800 hover:border-aura/40 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl text-xs tracking-widest uppercase font-light transition-all duration-300"
            >
              Вернуться в реальность
            </button>
          </div>
        )}
      </div>
    </main>
  );
}