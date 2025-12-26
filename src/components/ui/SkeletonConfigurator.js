
export default function SkeletonConfigurator() {
  return (
    <div 
      className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-w-lg w-full mx-auto flex flex-col min-h-[600px] animate-pulse"
      aria-busy="true"
    >
      {/* Step Navigation Skeleton */}
      <div className="flex justify-between items-center mb-8 relative">
          {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="h-4 w-12 bg-gray-200 mt-2 rounded"></div>
              </div>
          ))}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6 flex-grow">
          <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          
          <div className="grid grid-cols-3 gap-3 my-6">
             <div className="h-24 bg-gray-200 rounded-xl"></div>
             <div className="h-24 bg-gray-200 rounded-xl"></div>
             <div className="h-24 bg-gray-200 rounded-xl"></div>
          </div>

          <div className="flex flex-wrap gap-3">
             {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-10 h-10 rounded-full bg-gray-200"></div>)}
          </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
