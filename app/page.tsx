// app/page.tsx
import Link from 'next/link';
import ScrollToTop from './ScrollToTop'; // ★あとで作る魔法の部品を読み込む

export const revalidate = 0;

async function getWelcomePhotos() {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  const endpointName = "welcome-photos"; 

  const res = await fetch(`https://${domain}.microcms.io/api/v1/${endpointName}?limit=100`, {
    headers: {
      'X-MICROCMS-API-KEY': apiKey!,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.log("🚨 通信エラー:", res.status);
    return [];
  }

  const json = await res.json();

  if (!json.contents || json.contents.length === 0) {
    return [];
  }

  return json.contents
    .filter((item: any) => item.photo && item.photo.url)
    .map((item: any) => item.photo.url);
}

function shuffleArray(array: string[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function WelcomePage() {
  const welcomeImages = await getWelcomePhotos();
  const shuffledImages = shuffleArray(welcomeImages).slice(0, 8);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col items-center justify-between p-10 font-sans">
      
      {/* ★ここに魔法の部品を置く（画面には何も表示されません） */}
      <ScrollToTop />

      <div className="flex-grow flex flex-col gap-1 w-full max-w-lg items-center justify-center">
        {shuffledImages.map((src, index) => (
          <img
            key={index}
            src={`${src}?w=800&fm=webp&q=80`}
            alt={`Welcome vintage archive ${index + 1}`}
            className="w-full h-auto object-contain bg-gray-50 border border-gray-100"
            loading={index < 2 ? "eager" : "lazy"}
          />
        ))}
      </div>

      <div className="text-center mt-12 mb-10">
        <Link href="/store" className="text-sm tracking-[.3em] font-medium text-black hover:text-gray-400 transition-all duration-300">
          ENTER STORE
        </Link>
      </div>
    </div>
  );
}