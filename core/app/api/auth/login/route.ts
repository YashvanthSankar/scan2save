import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'Missing ID Token' }, { status: 400 });
    }

    // 1. Verify with Firebase
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'No phone number found' }, { status: 400 });
    }

    // 2. Sync with Database
    const user = await prisma.user.upsert({
      where: { phoneNumber: phoneNumber },
      update: {},
      create: {
        phoneNumber: phoneNumber,
        role: 'USER', 
      },
    });

    // 3. PREPARE THE RESPONSE
    const response = NextResponse.json({ 
      success: true, 
      userId: user.id,
      role: user.role 
    });

    // 4. SET THE COOKIE (The Missing Piece!)
    // This allows the middleware to let you into /admin
    response.cookies.set({
      name: 'session',
      value: JSON.stringify({ userId: user.id, role: user.role }),
      httpOnly: true, // Secure: JavaScript cannot read this
      path: '/',      // Valid for the whole app
      maxAge: 60 * 60 * 24 * 5, // 5 Days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Invalid Token' }, { status: 401 });
  }
}