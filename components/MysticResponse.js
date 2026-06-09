"use client";

export default function MysticResponse({ text }) {
  if (!text) return null;

  // Разбиваем текст на строки
  const lines = text.split("\n");

  return (
    <div className="space-y-6 font-light tracking-wide text-slate-300">
      {lines.map((line, index) => {
        // 1. Обработка заголовков второго уровня (## Название)
        if (line.startsWith("## ")) {
          const headingText = line.replace("## ", "");
          return (
            <h2 
              key={index} 
              className="text-xl md:text-2xl font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-mystic to-slate-400 mt-8 first:mt-0 border-b border-purple-950/40 pb-2"
            >
              {headingText}
            </h2>
          );
        }

        // 2. Обработка пустых строк (пропуски для воздуха в дизайне)
        if (line.trim() === "") {
          return <div key={index} className="h-2" />;
        }

        // 3. Обработка жирного текста внутри обычной строки (**текст**)
        // Простой регуляркой бьем строку на части со звездочками
        const parts = line.split(/(\*\*.*?\*\*)/g);
        
        return (
          <p key={index} className="text-sm md:text-base leading-relaxed text-slate-300/90">
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                const cleanText = part.slice(2, -2);
                return (
                  <strong key={partIndex} className="font-semibold text-mystic drop-shadow-[0_0_10px_rgba(167,139,250,0.2)]">
                    {cleanText}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}