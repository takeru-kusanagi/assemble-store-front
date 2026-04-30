// app/gallery/page.tsx (※お好みでファイル名やコンポーネント名はGalleryなどに変えてくださいね！)
import ScrollToTop from '@/app/ScrollToTop';

export const revalidate = 0;

async function getGalleryPhotos() {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  const endpointName = "gallery-photos"; 

  const res = await fetch(`https://${domain}.microcms.io/api/v1/${endpointName}?limit=100`, {
    headers: { 'X-MICROCMS-API-KEY': apiKey! },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const json = await res.json();
  if (!json.contents || json.contents.length === 0) return [];

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

export default async function ArchivePage() {
  const welcomeImages = await getGalleryPhotos();
  const shuffledImages = shuffleArray(welcomeImages).slice(0, 20); // 20枚ランダム

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-10 font-sans">
      <ScrollToTop />

      {/* ★アップデート：w-[90%] を w-full に戻し、Homeと全く同じサイズ感に統一 */}
      <div className="flex flex-col gap-1 w-full max-w-lg items-center">
        {shuffledImages.map((src, index) => (
          <img
            key={index}
            // ★アップデート：画像の解像度もHomeと同じ 800 に統一
            src={`${src}?w=800&fm=webp&q=80`}
            alt={`Gallery image ${index + 1}`}
            // ★アップデート：object-cover を object-contain に変更
            className="w-full h-auto object-contain bg-gray-50 border border-gray-100"
            loading={index < 2 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </div>
  );
}