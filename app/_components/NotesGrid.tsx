
// components/NotesGrid.js
import { useState, useEffect } from 'react';
import StickyNote from './StickyNote';
import { useAuth } from '../context/AuthContext';

export default function NotesGrid() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    const newNote = {
      title: 'New Note',
      content: 'Start typing...',
      color: '#23221d',
    };

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      const data = await res.json();
      setNotes([...notes, data.note]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async (id, updates) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      setNotes(notes.map(note => 
        note._id === id ? { ...note, ...updates } : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const updateNotePosition = async (id, position) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position }),
      });

      setNotes(notes.map(note => 
        note._id === id ? { ...note, position } : note
      ));
    } catch (error) {
      console.error('Error updating note position:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Notes</h2>
        <button
          onClick={createNote}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map(note => (
          <StickyNote
            key={note._id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onDrag={updateNotePosition}
          />
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes yet. Create your first note!</p>
        </div>
      )}
    </div>
  );
}