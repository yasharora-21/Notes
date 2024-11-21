import React from 'react';
import './Note.css';

function Note({ note, onDelete, onPin, onEdit }) {
    return (
        <div className={`note ${note.isPinned ? 'pinned' : ''}`}>
            <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-actions">
                    <button onClick={() => onPin(note.id)} title="Pin Note">📌</button>
                    <button onClick={() => onEdit(note.id)} title="Edit Note">✏️</button>
                    <button onClick={() => onDelete(note.id)} title="Delete Note">🗑️</button>
                </div>
            </div>
            <p>{note.content}</p>
            <span className="note-type">{note.type}</span>
        </div>
    );
}

export default Note;
