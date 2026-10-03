import React from "react";

const Loading = () => (
  <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-950/40 backdrop-blur-sm">
    <div className="relative flex items-center justify-center">
      <div className="absolute h-16 w-16 animate-pulse rounded-full bg-teal-500/10 blur-xl sm:h-20 sm:w-20" />

      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200/20 border-t-teal-500 sm:h-14 sm:w-14" />

      <div className="absolute h-5 w-5 rounded-full bg-teal-500/10 ring-1 ring-teal-400/20" />
    </div>
  </div>
);

export default Loading;
