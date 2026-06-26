

"use client";

import { useState, useEffect } from "react";
import { createClient } from "next-sanity";

// Initialize your client (Replace with your actual project details)
const sanityClient = createClient({
  projectId: "h9gfx3jy", // Find this in your sanity.config.ts or sanity.cli.ts
  dataset: "production",
  apiVersion: "2026-06-26",
  useCdn: true,
});

interface BookPage {
  _id: string;
  pageNumber: number;
  title: string;
  letter: string;
  imageUrl?: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Book turning state
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const anniversaryDate = "06292025";

  // Fetch from Sanity only when unlocked
  useEffect(() => {
    if (!isUnlocked) return;

    const fetchBookPages = async () => {
      try {
        // Query fetches the data ordered by your customized pageNumber
        const query = `*[_type == "memoryPage"] | order(pageNumber asc) {
          _id,
          pageNumber,
          title,
          letter,
          "imageUrl": image.asset->url
        }`;
        const data = await sanityClient.fetch(query);
        setPages(data);
      } catch (error) {
        console.error("Sanity fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookPages();
  }, [isUnlocked]);

  const handleNumber = (num: string) => {
    if (input.length >= 8 || isUnlocked) return;
    const newInput = input + num;
    setInput(newInput);

    if (newInput.length === 8) {
      if (newInput === anniversaryDate) {
        setMessage("Unlocked ❤️");
        setTimeout(() => setIsUnlocked(true), 600);
      } else {
        setMessage("Wrong Date 💔");
        setTimeout(() => {
          setInput("");
          setMessage("");
        }, 1500);
      }
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${(i * 13) % 100}%`,
    top: `${(i * 17) % 100}%`,
    delay: `${(i * 0.3) % 5}s`,
  }));

  return (
    <main className="relative min-h-screen overflow-x-hidden flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-[#050816] via-[#090b20] to-black text-white">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-12 left-12 opacity-30"><div className="h-16 w-16 rounded-full bg-white shadow-[0_0_40px_white]" /></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <span key={star.id} className="star absolute w-[2px] h-[2px] bg-white rounded-full opacity-40" style={{ left: star.left, top: star.top, animation: `pulse 2s infinite`, animationDelay: star.delay }} />
        ))}
      </div>

      {/* --- RENDER LOGIC --- */}
      {!isUnlocked ? (
        /* PASSCODE ENTRY MODULE */
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold text-center mb-2 text-pink-300 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
              ❤️ Happy Anniversary Maby ❤️
            </h1>
            <p className="text-zinc-400 text-center mb-8 text-sm">Enter the day our story began</p>
            <div className="flex justify-center gap-3 mb-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full border border-pink-400/50 transition-all ${i < input.length ? "bg-pink-400 scale-110 shadow-[0_0_12px_rgb(244,114,182)]" : "bg-transparent"}`} />
              ))}
            </div>
            <div className="h-6 mb-4 text-center">
              {message && <p className={`text-sm font-semibold ${message.includes("Unlocked") ? "text-green-400" : "text-red-400"}`}>{message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button key={num} onClick={() => handleNumber(num)} className="h-14 rounded-full border border-white/10 bg-white/5 text-xl font-bold hover:scale-105 active:scale-95 transition-all">{num}</button>
              ))}
              <button onClick={() => setInput("")} className="h-14 rounded-full bg-red-500/10 text-red-300 font-bold text-xs tracking-wider">CLEAR</button>
              <button key="0" onClick={() => handleNumber("0")} className="h-14 rounded-full border border-white/10 bg-white/5 text-xl font-bold">0</button>
              <button onClick={() => setInput(input.slice(0, -1))} className="h-14 rounded-full bg-blue-500/10 text-blue-300 text-xl">←</button>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE SKEUOMORPHIC BOOK INTERFACE */
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-fadeIn">
          
          {loading ? (
            <div className="text-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">Opening our book of memories...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-zinc-300">The book is currently empty.</p>
              <p className="text-xs text-zinc-500 mt-2">Go ahead and add your first page in Sanity Studio!</p>
            </div>
          ) : (
            <>
              {/* THE BOOK WRAPPER */}
              <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-[#1e1510] rounded-2xl p-3 md:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-4 border-[#2b1e17] flex justify-center items-center relative">
                
                {/* Subtle Book Center Binding Shadow */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-black/40 z-30 shadow-[0_0_10px_black]" />

                {/* TWO-PAGE SPREAD CONTAINER */}
                <div className="w-full h-full bg-[#fdfaf2] rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 text-zinc-900 shadow-inner relative">
                  
                  {/* LEFT PAGE: Photo Layer */}
                  <div className="p-6 flex flex-col justify-center items-center border-r border-zinc-300/60 bg-gradient-to-r from-[#f5f1e6] to-[#fdfaf2] h-full">
                    {pages[currentPage].imageUrl ? (
                      <div className="w-full h-full max-h-[80%] relative rounded-md overflow-hidden shadow-md border-8 border-white bg-zinc-200">
                        <img 
                          src={pages[currentPage].imageUrl} 
                          alt={pages[currentPage].title}
                          className="w-full h-full object-cover animate-fadeIn"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full max-h-[80%] border-2 border-dashed border-zinc-300 rounded-md flex items-center justify-center text-zinc-400 italic text-sm">
                        No image attached to this page
                      </div>
                    )}
                    <span className="text-xs font-mono mt-4 text-zinc-400">Page {currentPage * 2 + 1}</span>
                  </div>

                  {/* RIGHT PAGE: Text Letter Layer */}
                  <div className="p-6 flex flex-col justify-between bg-gradient-to-l from-[#f5f1e6] to-[#fdfaf2] h-full relative">
                    <div className="overflow-y-auto pr-1 max-h-[90%]">
                      <h2 className="text-2xl font-serif font-bold text-pink-700 mb-4 border-b border-pink-200 pb-2">
                        {pages[currentPage].title}
                      </h2>
                      <p className="font-serif text-sm md:text-base text-zinc-800 leading-relaxed whitespace-pre-line">
                        {pages[currentPage].letter}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 border-t border-zinc-200 pt-2 text-xs font-mono text-zinc-400">
                      <span>✨ Universe M&P</span>
                      <span>Page {currentPage * 2 + 2}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* NAVIGATION CONTROLS */}
              <div className="flex items-center gap-6 mt-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-pink-500/20 border border-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none font-medium text-sm transition-all shadow-md"
                >
                  ← Back
                </button>
                
                <span className="text-zinc-400 font-mono text-sm">
                  {currentPage + 1} / {pages.length}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === pages.length - 1}
                  className="px-5 py-2.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none font-medium text-sm transition-all shadow-md"
                >
                  Next Page →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}