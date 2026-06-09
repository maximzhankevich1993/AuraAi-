"use client";
import { useState } from "react";
import AuraBackground from "../components/AuraBackground";
import SmokeLoader from "../components/SmokeLoader";
import MysticResponse from "../components/MysticResponse";
import ShadowPassport from "../components/ShadowPassport"; // Импортируем Паспорт Тени

export default function Home() {
  const [activeTab, setActiveTab] = useState("dream"); // 'dream' или 'tarot'
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setShowResult(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, type: activeTab }),
      });

      const data = await response.json();

      if (data.result) {
        setAiResponse(data.result);
        setShowResult(true);
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
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Живой интерактивный фон */}
      <AuraBackground />

      {/* Эффект дыма при загрузке */}
      {isAnalyzing && <SmokeLoader />}

      {/* Контентная зона */}
      <div className="relative z-10 w-full max-w-2xl transition-all duration-700">
        
        {/* Шапка приложения */}
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

        {/* Экран ввода данных */}
        {!showResult && !isAnalyzing && (
          <div className="bg-void/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl shadow-aura-glow transition-all duration-500">
            <div className="flex border-b border-slate-800/80 mb-6">
              <button
                onClick={() => setActiveTab("dream")}
                className={`flex-1 pb-3 text-sm tracking-widest uppercase transition-all ${
                  activeTab === "dream"
                    ? "text-aura border-b-2 border-aura font-medium"
                    : "text-slate-500 hover:text-slate-400"
                }`}
              >
                🔮 Анализ Сновидения
              </button>
              <button
                onClick={() => setActiveTab("tarot")}
                className={`flex-1 pb-3 text-sm tracking-widest uppercase transition-all ${
                  activeTab === "tarot"
                    ? "text-aura border-b-2 border-aura font-medium"
                    : "text-slate-500 hover:text-slate-400"
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
                  ? "Опишите сюжет ночного видения, ключевые образы и ваши ощущения..."
                  : "Сформулируйте ваш запрос к картам. Что тревожит ваше ментальное поле?..."
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
        )}

        {/* Экран выдачи мистического результата */}
        {showResult && !isAnalyzing && (
          <div className="bg-void/30 backdrop-blur-lg border border-purple-900/30 p-6 md:p-8 rounded-2xl shadow-aura-glow max-h-[75vh] overflow-y-auto">
            
            {/* 1. Красивый структурированный разбор */}
            <MysticResponse text={aiResponse} />

            {/* 2. НОВОЕ: Виральная карта «Паспорт Тени» для скриншотов */}
            <ShadowPassport text={aiResponse} type={activeTab} />

            {/* Кнопка сброса */}
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