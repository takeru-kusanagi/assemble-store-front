// app/page.tsx
import Link from 'next/link';

export const revalidate = 0;

async function getWelcomePhotos() {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  const endpointName = "welcome-photos"; 

  // ★修正1：URLの末尾に「?limit=100」をつけて、全件取得するように変更！
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

// 配列をランダムに並べ替える関数
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
  const shuffledImages = shuffleArray(welcomeImages).slice(0, 7);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white flex flex-col items-center justify-between p-10 font-sans">
      
      <div className="flex-grow flex flex-col gap-1 w-full max-w-lg items-center justify-center">
        {shuffledImages.map((src, index) => (
          <img
            key={index}
            // ★修正2：画像URLにパラメータを足して、軽量化＆高速化する（横幅800px、webp形式、画質80%）
            src={`${src}?w=800&fm=webp&q=80`}
            alt={`Welcome vintage archive ${index + 1}`}
            className="w-full h-auto object-contain bg-gray-50 border border-gray-100"
            // ★さらに一工夫：最初の2枚だけ最優先で読み込み、残りはスクロールに合わせてサボりながら読み込む
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