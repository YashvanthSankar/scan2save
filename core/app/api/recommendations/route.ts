import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // 1. Check if we have cached recommendations in PersonalizedFeed
  const cachedFeed = await prisma.personalizedFeed.findMany({
    where: { userId: userId },
    include: { offer: { include: { product: true } } },
    orderBy: { relevanceScore: 'desc' }
  });

  // If we have data, return it
  if (cachedFeed.length > 0) {
    return NextResponse.json(cachedFeed);
  }

  // 2. If NO data (Cold Start), fetch default offers
  const defaultOffers = await prisma.activeOffer.findMany({
    where: { isDefault: true },
    include: { product: true }
  });

  return NextResponse.json(defaultOffers);
}