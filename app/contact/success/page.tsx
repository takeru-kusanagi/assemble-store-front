
import Link from "next/link";

export default function ContactSuccessPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-32 md:py-48 text-center min-h-[60vh]">
      <h1 className="text-xl md:text-2xl font-medium tracking-[0.3em] uppercase mb-6">
        Thank You
      </h1>
      <p className="text-xs text-gray-500 tracking-widest leading-loose mb-12">
        メッセージの送信が完了いたしました。<br />
        内容を確認次第、折り返しご連絡させていただきます。
      </p>
      <Link 
        href="/store" 
        className="bg-black text-white text-[10px] md:text-xs tracking-[0.2em] uppercase py-3 px-10 hover:bg-gray-300 hover:text-black border border-black transition-colors"
      >
        Return to Store
      </Link>
    </div>
  );
}