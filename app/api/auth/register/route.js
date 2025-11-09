// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { userId: user._id.toString() }, // Payload
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // ✅ CREATE RESPONSE WITH COOKIE
    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    // ✅ SET HTTP-ONLY COOKIE
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true, // Prevents JavaScript access (security)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/', // Available across entire site
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}