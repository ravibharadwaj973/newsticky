// app/api/notes/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Note from '../../models/Note';
import { getUserIdFromToken } from '../../lib/auth';

export async function PUT(request, { params }) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    console.log(id)
 
    const updates = await request.json();

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Error updating note' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params; // ← ADD 'await' HERE

    const note = await Note.findOneAndDelete({ _id: id, user: userId });

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Note deleted' });
    
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Error deleting note' },
      { status: 500 }
    );
  }
}