import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import './QuoteModal.css';

const ClearDatabaseModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = (e) => {
        e.preventDefault();
        if (confirmText !== 'clear db') {
            setError('Please type "clear db" exactly to confirm.');
            return;
        }
        setError('');
        onConfirm();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                    <div className="header-icon-container">
                        <Trash2 size={32} color="white" />
                    </div>
                    <h2>Clear Database</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>Dangerous Action - Data Wiping</p>
                </div>

                <div className="modal-body" style={{ padding: '2rem' }}>
                    <div className="warning-box" style={{
                        backgroundColor: '#fff5f5',
                        borderLeft: '4px solid #dc2626',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0 4px 4px 0'
                    }}>
                        <p style={{ color: '#dc2626', fontWeight: '600', marginBottom: '0.5rem' }}>
                            REPERCUSSIONS:
                        </p>
                        <ul style={{ color: '#991b1b', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                            <li>This will <strong>DELETE ALL</strong> existing claims, products, companies, blogs, policies, quotes, contacts, and reviews.</li>
                            <li><strong>USER ACCOUNTS WILL BE PRESERVED</strong> - all user data will remain intact.</li>
                            <li>This action is <strong>IRREVERSIBLE</strong>.</li>
                        </ul>
                    </div>

                    <div className="info-box" style={{
                        backgroundColor: '#f0f9ff',
                        borderLeft: '4px solid #0ea5e9',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0 4px 4px 0'
                    }}>
                        <p style={{ color: '#0ea5e9', fontWeight: '600', marginBottom: '0.5rem' }}>
                            WHAT WILL BE PRESERVED:
                        </p>
                        <ul style={{ color: '#0c4a6e', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                            <li>All user accounts and their credentials</li>
                            <li>User roles and permissions</li>
                            <li>User profile information</li>
                        </ul>
                    </div>

                    <form onSubmit={handleConfirm}>
                        <div className="input-group full-width">
                            <label htmlFor="confirmClear">Type <strong>clear db</strong> to confirm:</label>
                            <div className="input-wrapper">
                                <Trash2 size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="confirmClear"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="clear db"
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={onClose}
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-quote-btn"
                                style={{
                                    flex: 2,
                                    background: '#dc2626',
                                    margin: 0,
                                    opacity: confirmText === 'clear db' ? 1 : 0.6
                                }}
                                disabled={isSubmitting || confirmText !== 'clear db'}
                            >
                                {isSubmitting ? <span className="spinner"></span> : 'Clear Database (Keep Users)'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClearDatabaseModal;
