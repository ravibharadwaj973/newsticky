// app/api/notes/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../lib/dbConnect';
import Note from '../models/Note';
import { getUserIdFromToken } from '../lib/auth';

export async function GET(request) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const notes = await Note.find({ user: userId, isArchived: false })
      .sort({ updatedAt: -1 });
    
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Error fetching notes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const noteData = await request.json();
    
    const note = await Note.create({
      ...noteData,
      user: userId,
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Error creating note' },
      { status: 500 }
    );
  }
}
