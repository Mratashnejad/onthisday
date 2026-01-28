import React from 'react';

interface EventCardProps {
  year: string | number;
  title: string;
  category?: string;
}

export function EventCard({ year, title, category }: EventCardProps) {
  return (
    <div className="flex group hover:bg-gray-50 transition-colors border-b border-gray-200 py-4 last:border-0">
      {/* بخش سال */}
      <div className="w-24 flex-shrink-0 text-xl font-bold text-blue-600 pt-1">
        {year}
      </div>

      {/* بخش محتوا */}
      <div className="flex-grow">
        <h3 className="text-gray-800 text-lg font-medium leading-relaxed group-hover:text-blue-800 transition-colors">
          {title}
        </h3>
        {category && (
          <span className="inline-block mt-2 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}