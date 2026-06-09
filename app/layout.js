import "./globals.css";

export const metadata = {
  title: "AuraAI — Цифровой Оракул Подсознания",
  description: "Анонимный децентрализованный ИИ-анализ снов и юнгианские расклады Таро",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="antialiased bg-void text-slate-200">
        {children}
      </body>
    </html>
  );
}