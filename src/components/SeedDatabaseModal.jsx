import React, { useState } from 'react';
import { X, AlertTriangle, Database } from 'lucide-react';
import './QuoteModal.css';

const SeedDatabaseModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = (e) => {
        e.preventDefault();
        if (confirmText !== 'seed db') {
            setError('Please type "seed db" exactly to confirm.');
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

                <div className="modal-header" style={{ background: 'linear-gradient(135deg, var(--danger) 0%, #c53030 100%)' }}>
                    <div className="header-icon-container">
                        <AlertTriangle size={32} color="white" />
                    </div>
                    <h2>Seed Database</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>Dangerous Action - Data Wiping</p>
                </div>

                <div className="modal-body" style={{ padding: '2rem' }}>
                    <div className="warning-box" style={{
                        backgroundColor: '#fff5f5',
                        borderLeft: '4px solid #f56565',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0 4px 4px 0'
                    }}>
                        <p style={{ color: '#c53030', fontWeight: '600', marginBottom: '0.5rem' }}>
                            REPERCUSSIONS:
                        </p>
                        <ul style={{ color: '#742a2a', fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
                            <li>This will <strong>DELETE ALL</strong> existing products, blogs, services, and users.</li>
                            <li>The database will be restored to its initial default state.</li>
                            <li>This action is <strong>IRREVERSIBLE</strong>.</li>
                        </ul>
                    </div>

                    <form onSubmit={handleConfirm}>
                        <div className="input-group full-width">
                            <label htmlFor="confirmSeed">Type <strong>seed db</strong> to confirm:</label>
                            <div className="input-wrapper">
                                <Database size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="confirmSeed"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="seed db"
                                    required
                                    autoFocus
                                />
                            </div>
                            {error && <p style={{ color: '#c53030', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
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
                                    background: '#c53030',
                                    margin: 0,
                                    opacity: confirmText === 'seed db' ? 1 : 0.6
                                }}
                                disabled={isSubmitting || confirmText !== 'seed db'}
                            >
                                {isSubmitting ? <span className="spinner"></span> : 'Wipe and Seed Database'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SeedDatabaseModal;
