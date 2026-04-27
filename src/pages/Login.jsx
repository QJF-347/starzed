import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import apiService from '../services/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await apiService.login(formData);
            
            if (response.success) {
                // Store auth token
                localStorage.setItem('authToken', response.data.token.access);
                localStorage.setItem('refreshToken', response.data.token.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Redirect users based on their role
                if (response.data.user.role === 'admin') {
                    navigate('/admin');
                } else if (response.data.user.role === 'agent') {
                    navigate('/agent');
                } else {
                    navigate('/');
                }
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            // Handle validation errors from backend
            if (err.response && err.response.errors) {
                const errorMessages = [];
                for (const [field, messages] of Object.entries(err.response.errors)) {
                    errorMessages.push(`${field}: ${messages.join(', ')}`);
                }
                setError(`Validation errors: ${errorMessages.join('; ')}`);
            } else {
                setError(err.message || 'An error occurred during login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <h2>Welcome Back</h2>
                    <p>Please sign in to continue to your account.</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="login-error">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@domain.com"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="login-actions">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <Link to="/forgot-password" disabled className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="signup-prompt">
                        Don't have an account? <Link to="/register">Create one now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;