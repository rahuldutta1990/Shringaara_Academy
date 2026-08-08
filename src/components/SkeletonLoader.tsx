import React from 'react';

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-48 bg-slate-800/80"></div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-800 rounded-md"></div>
            <div className="h-4 w-12 bg-slate-800 rounded-md"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-800 rounded-md"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/60 rounded-md"></div>
            <div className="h-3 w-5/6 bg-slate-800/60 rounded-md"></div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
            <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
          </div>
        </div>
      </div>
      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
        <div className="h-6 w-20 bg-slate-800 rounded-md"></div>
        <div className="h-9 w-28 bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export const DashboardWidgetSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-slate-800 rounded-md"></div>
        <div className="w-8 h-8 rounded-xl bg-slate-800"></div>
      </div>
      <div className="h-8 w-16 bg-slate-800 rounded-md"></div>
      <div className="h-3 w-32 bg-slate-800/60 rounded-md"></div>
    </div>
  );
};

export const CourseProgressSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-slate-800 rounded-md"></div>
        <div className="h-3 w-20 bg-slate-800 rounded-md"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-10 rounded-xl bg-slate-800 shrink-0"></div>
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-slate-800 rounded-md"></div>
                  <div className="h-2 w-16 bg-slate-800/60 rounded-md"></div>
                </div>
              </div>
              <div className="h-5 w-10 bg-slate-800 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
