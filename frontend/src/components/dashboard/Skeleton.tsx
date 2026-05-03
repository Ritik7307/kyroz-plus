import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-card rounded-[2.5rem] border border-white/5 p-10 space-y-6 animate-pulse">
      <div className="h-48 w-full bg-white/5 rounded-3xl"></div>
      <div className="space-y-3">
        <div className="h-8 w-3/4 bg-white/5 rounded-lg"></div>
        <div className="h-4 w-1/2 bg-white/5 rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/5 rounded-lg"></div>
        <div className="h-3 w-full bg-white/5 rounded-lg"></div>
        <div className="h-3 w-2/3 bg-white/5 rounded-lg"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-14 flex-1 bg-white/5 rounded-2xl"></div>
        <div className="h-14 w-14 bg-white/5 rounded-2xl"></div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/5"></div>
      ))}
    </div>
  );
}
