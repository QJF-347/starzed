import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, LogIn, ArrowLeft, UserPlus } from 'lucide-react';
import apiService from '../services/api';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Frontend password validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Check for common passwords
        const commonPasswords = ['password', '12345678', 'admin123', 'qwerty', 'letmein'];
        if (commonPasswords.includes(formData.password.toLowerCase())) {
            setError('Password is too common. Please choose a stronger password.');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data for backend - send camelCase, serializer will convert to snake_case
            const registerData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                password_confirm: formData.confirmPassword
            };
            const response = await apiService.register(registerData);
            
            if (response.success) {
                // Store auth token
                localStorage.setItem('authToken', response.data.token.access);
                localStorage.setItem('refreshToken', response.data.token.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Redirect admin users to admin dashboard, others to home
                if (response.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setError(response.message || 'Registration failed');
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
                setError(err.message || 'An error occurred during registration. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
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

                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="firstName">First Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Last Name</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
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
