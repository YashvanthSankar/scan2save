import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 });
    }

    // --- DEV MODE: BYPASS FIREBASE TOKEN VERIFICATION ---
    // In production, you would verify the ID Token here.
    // For now, we trust the phone number sent by the client.
    
    // 1. Check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { phoneNumber },
      });
    }

    // 2. Return the user ID
    return NextResponse.json({ success: true, userId: user.id });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}