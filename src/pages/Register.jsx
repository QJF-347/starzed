import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, LogIn, ArrowLeft, UserPlus } from 'lucide-react';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        // Simple mock registration logic
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, we'd save to DB
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <h2>Create Account</h2>
                    <p>Join Starzed and manage all your insurance in one place.</p>
                </div>

                <form className="register-form" onSubmit={handleRegister}>
                    {error && <div className="register-error">{error}</div>}

                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

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
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone size={18} className="input-icon" />
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+254 700 000 000"
                                required
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
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Create Account
                            </>
                        )}
                    </button>

                    <div className="login-prompt">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
