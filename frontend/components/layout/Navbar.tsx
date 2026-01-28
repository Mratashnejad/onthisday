"use client";
import { SearchBar } from "../ui/SearchBar";
export function Navbar() {
  return (
    <header dir="rtl" className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-otd-blue rounded-xl flex items-center justify-center">
              <span className="font-black text-2xl text-otd-blue">O</span>
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight">
                ON THIS <span className="text-otd-yellow">DAY</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[3px] text-gray-400">
                Sports History
              </p>
            </div>



          </div>
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <SearchBar />
          </div>
        </div>

      </div>
    </header>
  );
}