import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onLogin, onSignup, onResetPassword }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (email.trim() === '' || password.trim() === '') {
            setError('Email and password cannot be empty.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save JWT token and handle login success
                localStorage.setItem('authToken', data.accessToken);
                onLogin(data); // Optionally pass the user data to a parent component
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error(error);
        }
    };

    const handleSignup = async () => {
        if (email.trim() === '' || password.trim() === '') {
            setError('Email and password cannot be empty.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password}),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful signup (e.g., auto-login or show success message)
                localStorage.setItem('authToken', data.accessToken);
                onSignup(data); // Optionally pass the user data to a parent component
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error(error);
        }
    };

    const handleResetPassword = async () => {
        if (email.trim() === '') {
            setError('Email cannot be empty for password reset.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Password reset email sent!');
                setIsResetPassword(false);
            } else {
                setError(data.message || 'Error sending reset email');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error(error);
        }
    };

    return (
        <div className="auth-form">
            {isResetPassword ? (
                <>
                    <h2>Reset Password</h2>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <button onClick={handleResetPassword}>Reset Password</button>
                    <button onClick={() => setIsResetPassword(false)}>Back to Login</button>
                </>
            ) : (
                <>
                    <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    {isLogin && (
                        <input  // This is the password field for login
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    )}   
                    {!isLogin && (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    )}
                    <button onClick={isLogin ? handleLogin : handleSignup}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Go to Sign Up' : 'Go to Login'}
                    </button>
                    <button onClick={() => setIsResetPassword(true)}>Forgot Password?</button>
                </>
            )}
        </div>
    );
}

export default AuthForm;
