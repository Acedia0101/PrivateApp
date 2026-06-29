"use client";

import { useState, useEffect } from "react";
import { createClient } from "next-sanity";

// Initialize your client
const sanityClient = createClient({
  projectId: "h9gfx3jy", 
  dataset: "production",
  apiVersion: "2026-06-26",
  useCdn: true,
});

// 1. FIXED: Changed imageUrls to string[] so TypeScript knows it's an array of image links
interface BookPage {
  _id?: string;
  pageNumber: number;
  title: string;
  letter: string;
  imageUrls: string[]; 
}

export default function Home() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Book turning state
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const anniversaryDate = "06292025";

  // Fetch from Sanity only when unlocked
  useEffect(() => {
    if (!isUnlocked) return;

    const fetchBookPages = async () => {
      try {
        const query = `*[_type == "memoryPage"] | order(pageNumber asc) {
          title,
          letter,
          pageNumber,
          "imageUrls": images[].asset->url
        }`;
        const data = await sanityClient.fetch(query);
        // Fallback to empty array if data or imageUrls is missing
        const formattedData = data.map((page: any) => ({
          ...page,
          imageUrls: page.imageUrls || []
        }));
        setPages(formattedData);
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

  // Helper variable for cleaner, safer page reading
  const activePage = pages[currentPage];

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
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center animate-fadeIn px-2 md:px-0">
          
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
          ) : !isBookOpen ? (
            
            /* DISPLAY THE CLOSED BOOK COVER PAGE */
            <div 
              onClick={() => setIsBookOpen(true)}
              className="w-full max-w-md aspect-[10/13] md:aspect-[10/14] bg-gradient-to-br from-[#3d271d] via-[#2b1e17] to-[#1a120d] rounded-r-2xl p-6 shadow-[10px_20px_50px_rgba(0,0,0,0.9)] border-y-4 border-r-4 border-l-[12px] border-[#231812] flex flex-col justify-between items-center text-center cursor-pointer transform hover:scale-[1.02] hover:rotate-1 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Gold Foil Border Accent */}
              <div className="absolute inset-4 border border-amber-500/20 rounded-md pointer-events-none" />
              <div className="absolute inset-5 border-2 border-amber-500/10 rounded-sm pointer-events-none" />

              <div className="mt-12 space-y-2 z-10">
                <span className="text-xs tracking-[0.3em] uppercase text-amber-400/70 font-serif">Our Private Chapter</span>
                <div className="w-12 h-[1px] bg-amber-500/30 mx-auto my-2" />
              </div>

              {/* Main Elegant Title */}
              <div className="z-10 px-4">
                <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-wide text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Our Book of Memories
                </h1>
                <p className="text-xs italic font-serif text-amber-400/60 mt-4 tracking-widest">
                  Dedicated to My Princess
                </p>
              </div>

              {/* Bottom Cover Accent / Prompt */}
              <div className="mb-8 z-10 animate-pulse group-hover:text-pink-300 transition-colors">
                <span className="text-[11px] font-mono tracking-widest text-zinc-400 block uppercase">
                  Click to Open
                </span>
                <span className="text-lg mt-1 block">✨</span>
              </div>
            </div>

          ) : (
            
            /* DISPLAY THE OPENED TWO-PAGE SPREAD BOOK */
            <>
              <div className="w-full h-auto min-h-[500px] md:aspect-[16/10] bg-[#1e1510] rounded-2xl p-3 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#2b1e17] flex justify-center items-center relative">
                
                {/* Subtle Book Center Binding Line */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-black/30 z-30 shadow-[0_0_8px_black]" />

                {/* RESPONSIVE PAGE SPREAD CONTAINER */}
                <div className="w-full h-full bg-[#fdfaf2] rounded-lg overflow-hidden flex flex-col md:grid md:grid-cols-2 text-zinc-900 shadow-inner relative">
                  
                 {/* LEFT PAGE: Photo Layer (Fixed Top Aligned Scrollable Gallery) */}
                  <div className="p-4 md:p-6 flex flex-col justify-start items-center border-b md:border-b-0 md:border-r border-zinc-300/60 bg-gradient-to-r from-[#f5f1e6] to-[#fdfaf2] h-[450px] md:h-full w-full relative overflow-hidden">
                    
                    {/* Pictures Scroll Area Container */}
                    <div className="w-full overflow-y-auto max-h-[380px] md:max-h-[88%] pr-1 mt-2 flex flex-col justify-start">
                      
                      {activePage?.imageUrls && activePage.imageUrls.length > 0 ? (
                        /* GRID CONFIGURATION */
                        <div className={`w-full gap-3 grid p-1
                          ${activePage.imageUrls.length === 1 ? 'grid-cols-1 max-w-[300px] md:max-w-[340px] mx-auto' : 'grid-cols-2'}
                        `}>
                          {activePage.imageUrls.map((url: string, index: number) => (
                            <div 
                              key={index} 
                              className={`relative rounded-md overflow-hidden shadow-md border-2 md:border-4 border-white bg-zinc-200 w-full
                                ${activePage.imageUrls.length === 1 ? 'aspect-[3/4]' : 'aspect-[4/3] md:aspect-square'}
                              `}
                            >
                              <img 
                                src={url} 
                                alt={`Memory photo ${index + 1}`}
                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300 block"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full max-w-[280px] md:max-w-none h-48 md:h-full border-2 border-dashed border-zinc-300 rounded-md flex items-center justify-center text-zinc-400 italic text-sm my-auto">
                          No images attached to this page
                        </div>
                      )}

                    </div>

                    {/* Page number pinned neatly at the bottom edge */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none bg-gradient-to-t from-[#fdfaf2] via-[#fdfaf2] to-transparent pt-2 pb-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Page {currentPage * 2 + 1}
                      </span>
                    </div>
                  </div>
                                                          
  

                  {/* RIGHT PAGE: Text Letter Layer */}
                  <div className="p-5 md:p-6 flex flex-col justify-between bg-gradient-to-l from-[#f5f1e6] to-[#fdfaf2] flex-1 md:h-full relative w-full">
                    <div className="overflow-y-auto pr-1 max-h-[220px] md:max-h-[90%]">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-pink-700 mb-2 md:mb-4 border-b border-pink-200 pb-2">
                        {activePage?.title}
                      </h2>
                      <p className="font-serif text-sm md:text-base text-zinc-800 leading-relaxed whitespace-pre-line tracking-wide">
                        {activePage?.letter}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 border-t border-zinc-200 pt-2 text-[10px] font-mono text-zinc-400">
                      <span>✨ Universe M&P</span>
                      <span>Page {currentPage * 2 + 2}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* NAVIGATION CONTROLS */}
              <div className="flex items-center gap-6 mt-6 md:mt-8">
                {/* Close Book Button */}
                <button
                  onClick={() => {
                    setIsBookOpen(false);
                    setCurrentPage(0); 
                  }}
                  className="px-3 py-1.5 rounded-md bg-zinc-800/60 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-zinc-200 font-mono text-xs transition-all mr-2"
                >
                  📕 Close Book
                </button>

                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-pink-500/20 border border-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none font-medium text-xs md:text-sm transition-all shadow-md"
                >
                  ← Back
                </button>
                
                <span className="text-zinc-400 font-mono text-xs md:text-sm">
                  {currentPage + 1} / {pages.length}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === pages.length - 1}
                  className="px-4 py-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none font-medium text-xs md:text-sm transition-all shadow-md"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}