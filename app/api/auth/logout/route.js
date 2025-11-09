// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
  // ✅ CREATE RESPONSE AND CLEAR COOKIE
  const response = NextResponse.json({ 
    message: 'Logged out successfully' 
  });

  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });

  return response;
}