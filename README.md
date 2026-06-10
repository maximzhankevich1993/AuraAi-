# 🔮 AuraAI — Decentralized Subconscious Oracle

AuraAI is a mystical, high-performance Web application built with **Next.js 14**, **TailwindCSS**, **Yandex GPT API**, and **Supabase**. It utilizes modern AI models to interpret user dreams through Jungian psychoanalysis and perform structured digital Tarot readings, generating viral visual assets for social media expansion.

## 🚀 Key Features

* **🔮 Dream Analysis:** Deconstructs nightmares and visions using Carl Jung’s archetypal frameworks (Shadow, Anima/Animus, Ego).
* **🎴 Digital Tarot Spreads:** Conducts structured esoteric readings mapped directly to the user's mental field.
* **⚡ Shadow Passport (Viral Engine):** Generates custom 9:16 high-fidelity digital identity cards based on AI metrics, optimized for instant screenshots and social sharing (TikTok, Instagram, Telegram).
* **📜 Shadow Archive:** Fast, secure, and private data persistence powered by Supabase. Utilizes anonymous local session tracking to keep user logs isolated and confidential without complex OAuth.
* **🌌 Immersive UI/UX:** Dark-mode cyber-mysticism aesthetic featuring dynamic canvas-based aura glows, smoke fluid loading states, and full Markdown typography rendering.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Client/Server Architecture)
* **Styling:** TailwindCSS + Framer Motion animations
* **Database & Persistence:** Supabase (PostgreSQL)
* **Artificial Intelligence:** Yandex Cloud Foundation Models (YandexGPT Lite)
* **Deployment Ready:** Vercel / Docker

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# Yandex Cloud (AI Layer)
YANDEX_API_KEY="your_yandex_api_key_here"
YANDEX_FOLDER_ID="your_yandex_folder_id_here"

# Supabase (Data Layer)
NEXT_PUBLIC_SUPABASE_URL="[https://your-project-id.supabase.co](https://your-project-id.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_public_anon_key_here"