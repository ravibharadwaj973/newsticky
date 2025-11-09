"use client";
// components/StickyNote.tsx
import { useState, DragEvent, ChangeEvent } from 'react';

// Define TypeScript interfaces
interface Position {
  x: number;
  y: number;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  position: Position;
  user: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteUpdates {
  title?: string;
  content?: string;
  color?: string;
  position?: Position;
  isArchived?: boolean;
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: NoteUpdates) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDrag: (id: string, position: Position) => Promise<void>;
}

export default function StickyNote({ note, onUpdate, onDelete, onDrag }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(note.title);
  const [content, setContent] = useState<string>(note.content);

  const handleSave = async (): Promise<void> => {
    await onUpdate(note._id, { title, content });
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setContent(e.target.value);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    onDrag(note._id, {
      x: rect.left,
      y: rect.top
    });
  };

  const handleEditClick = (): void => {
    setIsEditing(true);
  };

  const handleDeleteClick = (): void => {
    onDelete(note._id);
  };

  return (
    <div
      className={`w-64 h-64 rounded-lg shadow-lg p-4 cursor-move relative ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      style={{ backgroundColor: note.color, transform: `translate(${note.position.x}px, ${note.position.y}px)` }}
      draggable
      onDragEnd={handleDragEnd}
    >
      {/* Note Header */}
      <div className="flex justify-between items-center mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-transparent font-bold text-lg border-b border-gray-800 focus:outline-none"
            placeholder="Title"
          />
        ) : (
          <h3 className="font-bold text-lg truncate">{note.title}</h3>
        )}
        
        <div className="flex space-x-1">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave} 
                className="text-green-600 hover:text-green-800"
                type="button"
              >
                ✓
              </button>
              <button 
                onClick={handleCancel} 
                className="text-red-600 hover:text-red-800"
                type="button"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleEditClick} 
                className="text-blue-600 hover:text-blue-800"
                type="button"
              >
                ✏️
              </button>
              <button 
                onClick={handleDeleteClick} 
                className="text-red-600 hover:text-red-800"
                type="button"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="h-44 overflow-y-auto">
        {isEditing ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="w-full h-full bg-transparent resize-none focus:outline-none"
            placeholder="Take a note..."
          />
        ) : (
          <p className="whitespace-pre-wrap break-words">{note.content}</p>
        )}
      </div>

      {/* Note Footer */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-600">
        {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}