import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
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
            // Simulated login for demo purposes
            // In a real app, this would be a fetch call to your backend
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (formData.email === 'admin@starzed.com' && formData.password === 'password123') {
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
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