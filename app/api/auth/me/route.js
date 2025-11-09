// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.userEmail,
       
      }
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null });
  }
}