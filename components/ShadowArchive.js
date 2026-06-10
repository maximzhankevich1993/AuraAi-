"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ShadowArchive({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      let sessionId = localStorage.getItem("aura_session_id");
      if (!sessionId) {
        sessionId = "_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("aura_session_id", sessionId);
      }

      const { data, error } = await supabase
        .from("shadow_history")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error loading history:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 text-center text-xs text-mystic/40 tracking-widest uppercase animate-pulse font-mono">
        Synchronizing with Akashic Chronicles...
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-2xl animate-fade-in px-2">
      <h3 className="text-sm font-serif tracking-widest text-aura uppercase mb-4 text-center">
        📜 Your Submersion Archive
      </h3>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group flex justify-between items-center bg-void/20 hover:bg-void/50 border border-slate-900 hover:border-purple-900/40 p-4 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">
                {item.type === "dream" ? "🔮" : "🎴"}
              </span>
              <div>
                <p className="text-xs text-slate-400 font-light line-clamp-1 max-w-[280px] md:max-w-[400px]">
                  {item.input_text}
                </p>
                <span className="text-[10px] text-slate-600 font-mono">
                  {new Date(item.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-600 group-hover:text-aura transition-colors font-mono">
              →
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#09090f] border border-purple-900/30 p-6 rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h4 className="text-xs font-mono tracking-widest uppercase text-aura">
                Record from {new Date(selectedItem.created_at).toLocaleDateString("en-US")}
              </h4>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-500 hover:text-slate-200 font-mono text-sm"
              >
                [close]
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Your Request:</span>
                <p className="text-sm text-slate-300 italic mt-1 bg-void/40 p-3 rounded-lg border border-slate-900">
                  “{selectedItem.input_text}”
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Oracle Verdict:</span>
                <div className="text-sm text-slate-300 leading-relaxed mt-2 whitespace-pre-wrap font-light">
                  {selectedItem.ai_response}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}