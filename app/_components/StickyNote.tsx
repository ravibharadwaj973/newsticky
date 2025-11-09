"use client"
// components/StickyNote.js
import { useState } from 'react';

export default function StickyNote({ note, onUpdate, onDelete, onDrag }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = async () => {
    await onUpdate(note._id, { title, content });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`w-64 h-64 rounded-lg shadow-lg p-4 cursor-move relative ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      style={{ backgroundColor: note.color, transform: `translate(${note.position.x}px, ${note.position.y}px)` }}
      draggable
      onDragEnd={(e) => {
        const rect = e.target.getBoundingClientRect();
        onDrag(note._id, {
          x: rect.left,
          y: rect.top
        });
      }}
    >
      {/* Note Header */}
      <div className="flex justify-between items-center mb-2">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent font-bold text-lg border-b border-gray-800 focus:outline-none"
            placeholder="Title"
          />
        ) : (
          <h3 className="font-bold text-lg truncate">{note.title}</h3>
        )}
        
        <div className="flex space-x-1">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="text-green-600 hover:text-green-800">✓</button>
              <button onClick={handleCancel} className="text-red-600 hover:text-red-800">✕</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800">✏️</button>
              <button onClick={() => onDelete(note._id)} className="text-red-600 hover:text-red-800">🗑️</button>
            </>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="h-44 overflow-y-auto">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
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