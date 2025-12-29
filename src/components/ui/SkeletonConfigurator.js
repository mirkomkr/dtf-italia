
export default function SkeletonConfigurator() {
  return (
    <div 
      className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-indigo-500/20 shadow-2xl min-h-[600px] max-w-4xl w-full mx-auto flex flex-col animate-pulse"
      style={{ minHeight: '600px', contentVisibility: 'auto' }}
      aria-busy="true"
    >
      {/* Step Navigation Skeleton */}
      <div className="flex justify-between items-center mb-12 px-12 relative">
          {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center z-10 gap-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100"></div>
                  <div className="h-3 w-16 bg-slate-100 rounded"></div>
              </div>
          ))}
          <div className="absolute top-5 left-12 right-12 h-1 bg-slate-50 -z-0"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-8 flex-grow">
          {/* Title Mock */}
          <div className="h-6 bg-slate-200 w-1/3 rounded mb-6"></div>
          
          {/* Grid Mock (3 cols as per new design) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="h-24 bg-slate-100 rounded-xl border-2 border-slate-50"></div>
             ))}
          </div>

          {/* Quantity Mock */}
          <div className="flex justify-between items-center mt-8 p-4 bg-slate-50 rounded-xl">
             <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
             <div className="h-10 w-24 bg-indigo-100 rounded-lg"></div>
          </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <div className="h-12 bg-indigo-200 rounded-xl w-48"></div>
      </div>
    </div>
  );
}
