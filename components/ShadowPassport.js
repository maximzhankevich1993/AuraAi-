"use client";
import { useState, useEffect } from "react";

export default function ShadowPassport({ text, type }) {
  const [metrics, setMetrics] = useState(null);

  // Генерируем псевдослучайные, но стабильные метрики на основе текста ответа
  useEffect(() => {
    if (!text) return;

    // Простая хэш-функция, чтобы для одного и того же ответа метрики были одинаковыми
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const score = Math.abs((hash % 31) + 65); // Индекс от 65 до 95%
    const ego = Math.abs(((hash >> 2) % 40) + 50);
    const anima = Math.abs(((hash >> 4) % 40) + 50);
    const shadow = Math.abs(((hash >> 6) % 40) + 50);

    // Списки мистических званий в зависимости от типа запроса
    const dreamTitles = ["Архитектор Бездны", "Ловец Кошмаров", "Ткач Люцидных Снов", "Странник Между Мирами"];
    const tarotTitles = ["Верховный Инициат", "Хранитель Ключей", "Ментальный Алхимик", "Призыватель Судеб"];
    
    const titles = type === "dream" ? dreamTitles : tarotTitles;
    const assignedTitle = titles[Math.abs(hash) % titles.length];

    setMetrics({ score, ego, anima, shadow, title: assignedTitle });
  }, [text, type]);

  if (!metrics) return null;

  return (
    <div className="mt-8 flex flex-col items-center justify-center w-full animate-fade-in">
      {/* Текст-инструкция для юзера */}
      <p className="text-xs text-mystic/50 tracking-widest uppercase mb-4 text-center">
        ⚡ Сделай скриншот карты для соцсетей
      </p>

      {/* Сама виральная карточка (формат 9:16 / Tarot Card) */}
      <div className="relative w-full max-w-[360px] aspect-[9/14] bg-gradient-to-b from-[#09090e] via-[#030305] to-[#120a1c] border-2 border-purple-500/30 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(147,51,234,0.15)]">
        
        {/* Магический фоновый узор (Сакральная геометрия через CSS) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-slate-100 rounded-full animate-spin-slow" />
          <div className="absolute w-48 h-48 border border-slate-100 rotate-45" />
          <div className="absolute w-48 h-48 border border-slate-100 -rotate-45" />
        </div>

        {/* Верхний блок: Заголовок карты */}
        <div className="relative z-10 flex justify-between items-start border-b border-purple-950/50 pb-4">
          <div>
            <h4 className="text-xs font-serif tracking-widest text-aura uppercase">Shadow Passport</h4>
            <h3 className="text-lg font-serif text-slate-100 tracking-wider mt-1">{metrics.title}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 tracking-widest uppercase">ID проекта</span>
            <div className="text-xs font-mono text-slate-300">#AURA-{Math.abs(metrics.ego * metrics.score).toString(16).toUpperCase().slice(0, 5)}</div>
          </div>
        </div>

        {/* Средний блок: Визуальный Идентификатор (Glowing Eye/Orb) */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4">
          <div className="relative w-24 h-24 rounded-full bg-void border border-purple-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.2)]">
            {/* Наш кастомный неоновый зрачок оракула */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 animate-pulse" />
            <div className="absolute w-16 h-16 border border-dashed border-purple-500/20 rounded-full animate-spin-slow" />
          </div>
          <div className="mt-3 text-center">
            <span className="text-[10px] text-slate-500 tracking-widest uppercase block">Индекс Интеграции</span>
            <span className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 font-bold tracking-tighter">
              {metrics.score}%
            </span>
          </div>
        </div>

        {/* Нижний блок: Психологические характеристики (Слайдеры) */}
        <div className="relative z-10 space-y-3.5 border-t border-purple-950/50 pt-4">
          {/* Метрика 1 */}
          <div>
            <div className="flex justify-between text-[11px] tracking-wider mb-1">
              <span className="text-slate-400 uppercase">Ego (Сознание)</span>
              <span className="text-purple-400 font-mono">{metrics.ego}%</span>
            </div>
            <div className="w-full h-1 bg-void rounded-full overflow-hidden border border-slate-900">
              <div className="h-full bg-purple-500/80 rounded-full" style={{ width: `${metrics.ego}%` }} />
            </div>
          </div>

          {/* Метрика 2 */}
          <div>
            <div className="flex justify-between text-[11px] tracking-wider mb-1">
              <span className="text-slate-400 uppercase">Anima / Animus</span>
              <span className="text-purple-400 font-mono">{metrics.anima}%</span>
            </div>
            <div className="w-full h-1 bg-void rounded-full overflow-hidden border border-slate-900">
              <div className="h-full bg-pink-500/80 rounded-full" style={{ width: `${metrics.anima}%` }} />
            </div>
          </div>

          {/* Метрика 3 */}
          <div>
            <div className="flex justify-between text-[11px] tracking-wider mb-1">
              <span className="text-slate-400 uppercase">Shadow (Скрытое)</span>
              <span className="text-purple-400 font-mono">{metrics.shadow}%</span>
            </div>
            <div className="w-full h-1 bg-void rounded-full overflow-hidden border border-slate-900">
              <div className="h-full bg-indigo-500/80 rounded-full" style={{ width: `${metrics.shadow}%` }} />
            </div>
          </div>
        </div>

        {/* Футер карты */}
        <div className="relative z-10 flex justify-between items-center mt-2 text-[9px] font-mono text-slate-600 tracking-widest uppercase">
          <div>AURA.AI // DECENTRALIZED</div>
          <div>VER. 1.0.0</div>
        </div>
      </div>
    </div>
  );
}