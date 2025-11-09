// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    // ✅ GENERATE JWT TOKEN
    const token = jwt.sign(
      { userId: user._id.toString(),
        userEmail: user.email, // ← Add email to payload
    userName: user.name    // ← Add name too
       },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ CREATE RESPONSE WITH COOKIE
    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}