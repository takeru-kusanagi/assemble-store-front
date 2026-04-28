// app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center">
        {/* animate-pulse で、テキストをゆっくりフワッフワッと点滅させます */}
        <span className="text-[10px] tracking-[.3em] font-medium text-gray-300 animate-pulse">
          LOADING...
        </span>
      </div>
    );
  }