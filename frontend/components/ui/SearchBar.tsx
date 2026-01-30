"use client";
import React from "react";
export function SearchBar() {
  return (
    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden h-11 w-[800]">
      {/* Input */}
      <input
        type="text"
        placeholder="جستجو در ۲۰۰ سال تاریخ ورزش..."
        className="flex-1 px-5 text-sm outline-none placeholder:text-gray-400"
      />
      {/* Divider */}
      <div className="w-px h-6 bg-gray-300" />
      {/* Category */}
      <select
        className="px-4 text-sm font-bold bg-transparent outline-none cursor-pointer text-gray-700"
        defaultValue="events"
      >
        <option value="events">رویدادها</option>
        <option value="birthdays">تولدها</option>
        <option value="deaths">درگذشتگان</option>
      </select>

      {/* Button */}
      <button className="px-6 h-full font-black text-sm bg-gray-900 text-white">
        جستجو
      </button>
    </div>
  );
}