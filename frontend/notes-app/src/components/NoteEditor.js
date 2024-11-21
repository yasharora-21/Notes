import React, { useState } from 'react';
import './NoteEditor.css';

function NoteEditor({ onCreateNote }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('General');
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (title.trim() === '' || content.trim() === '') {
            setError('Title and content cannot be empty.');
            return;
        }
        
        onCreateNote({
            id: Date.now(),
            title,
            content,
            type,
            isPinned: false,
        });

        setTitle('');
        setContent('');
        setType('General');
        setError('');
    //     try{
    //         const response =  await fetch('',{
    //             body:JSON.parse(onCreateNote)
    //         })
    //         const data = response.json();
    //     }catch(err){
    //         console.log(err);
            
    //     }
    }; 

    return (
        <div className="note-editor">
            <h3>Create a Note</h3>
            {error && <p className="error-message">{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note Content"
            ></textarea>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
            </select>
            <button onClick={handleSave}>Save Note</button>
        </div>
    );
}

export default NoteEditor;
