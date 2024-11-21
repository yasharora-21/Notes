import React from 'react';
import Note from './Note';
import './NotesList.css';

function NotesList({ notes, onDelete, onPin, onEdit }) {
    return (
        <div className="notes-list">
            {notes.map((note) => (
                <Note 
                    key={note.id} 
                    note={note} 
                    onDelete={onDelete} 
                    onPin={onPin} 
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default NotesList;
