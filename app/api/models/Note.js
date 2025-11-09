// models/Note.js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#ffeb3b', // Yellow
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);