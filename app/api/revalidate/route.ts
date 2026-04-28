// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  // URLの末尾につけた合言葉（secret）を取得
  const secret = req.nextUrl.searchParams.get('secret');

  // もし合言葉が間違っていたら、怪しいアクセスとして弾く
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // サイト全体の記憶（キャッシュ）を強制的に削除して、最新状態にする
    revalidatePath('/', 'layout');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
