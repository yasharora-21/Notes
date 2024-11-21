import React, { useState, useEffect } from 'react';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import AuthForm from './components/AuthForm';
import { login, logout, resetPassword, signup } from './utils/auth';
import './styles/App.css';

function App() {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // If there's a token in localStorage, attempt to restore the user session
        const token = localStorage.getItem('authToken');
        if (token) {
            setUser({ token }); // Optionally fetch user info from the backend using the token
        }
    }, []);

    const handleLogin = async (credentials) => {
        const loggedInUser = await login(credentials);
        if (loggedInUser) setUser(loggedInUser);
    };

    const handleSignup = async (credentials) => {
        const newUser = await signup(credentials);
        if (newUser) setUser(newUser);
    };

    const handleResetPassword = async (email) => {
        const resetResult = await resetPassword(email);
        if (resetResult.success) {
            alert('Password reset link sent to your email');
        } else {
            alert('Failed to send password reset link');
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    const fetchNotes = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;  // If there's no token, don't fetch notes

        try {
            const response = await fetch('http://localhost:8000/get-notes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotes(data.notes); // Assuming the response contains notes
            } else {
                alert('Failed to load notes');
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            alert('An error occurred while fetching notes.');
        }
    };

    const handleNoteCreate = async (note) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:8000/add-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(note),
            });

            const data = await response.json();
            if (response.ok) {
                setNotes([...notes, data.note]);
            } else {
                alert('Failed to create note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
            alert('An error occurred while adding the note.');
        }
    };

    const handleDeleteNote = async (id) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:8000/delete-note/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setNotes(notes.filter((note) => note.id !== id));
            } else {
                alert('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('An error occurred while deleting the note.');
        }
    };

    const handlePinNote = (id) => {
        setNotes(
            notes.map((note) => 
                note.id === id ? { ...note, isPinned: !note.isPinned } : note
            )
        );
    };

    const handleEditNote = async (id) => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            const updatedContent = prompt("Edit Note Content:", noteToEdit.content);
            if (updatedContent !== null) {
                const token = localStorage.getItem('authToken');
                if (!token) return;

                try {
                    const response = await fetch(`http://localhost:8000/edit-note/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ content: updatedContent }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        setNotes(
                            notes.map((note) => 
                                note.id === id ? { ...note, content: updatedContent } : note
                            )
                        );
                    } else {
                        alert('Failed to update note');
                    }
                } catch (error) {
                    console.error('Error editing note:', error);
                    alert('An error occurred while editing the note.');
                }
            }
        }
    };

    return (
        <div className="app">
            {!user ? (
                <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
            ) : (
                <>
                    <div className="header">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <div className="main">
                        <NoteEditor onCreateNote={handleNoteCreate} />
                        <NotesList 
                            notes={notes} 
                            onDelete={handleDeleteNote} 
                            onPin={handlePinNote} 
                            onEdit={handleEditNote} 
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
