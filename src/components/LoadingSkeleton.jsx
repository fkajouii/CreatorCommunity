import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-pulse space-y-6">
    <div className="flex justify-between items-start">
      <div className="bg-gray-100 h-14 w-14 rounded-2xl" />
      <div className="bg-gray-100 h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="bg-gray-100 h-8 w-3/4 rounded-lg" />
      <div className="bg-gray-100 h-4 w-1/2 rounded-lg" />
    </div>
    <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="bg-gray-100 h-3 w-12 rounded" />
        <div className="bg-gray-100 h-5 w-20 rounded" />
      </div>
      <div className="space-y-2">
        <div className="bg-gray-100 h-3 w-12 rounded" />
        <div className="bg-gray-100 h-5 w-20 rounded" />
      </div>
    </div>
    <div className="bg-gray-100 h-14 w-full rounded-2xl" />
  </div>
);

export const ListSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="p-6 flex items-center justify-between border-b border-gray-50 last:border-0">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <div className="bg-gray-100 h-5 w-32 rounded" />
            <div className="bg-gray-100 h-3 w-20 rounded" />
          </div>
        </div>
        <div className="flex space-x-12">
          <div className="bg-gray-100 h-8 w-20 rounded" />
          <div className="bg-gray-100 h-8 w-24 rounded" />
        </div>
      </div>
    ))}
  </div>
);
