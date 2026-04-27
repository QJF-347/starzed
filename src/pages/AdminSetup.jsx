import React, { useState } from 'react';
import { Database, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import api from '../services/api';
import SeedDatabaseModal from '../components/SeedDatabaseModal';
import ClearDatabaseModal from '../components/ClearDatabaseModal';
import './AdminDashboard.css';

const AdminSetup = () => {
    const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            const response = await api.seedDatabase();
            if (response.success) {
                alert('Database seeded successfully! The system will now reload.');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error seeding database:', error);
            alert('Error seeding database: ' + error.message);
        } finally {
            setIsSeeding(false);
            setIsSeedModalOpen(false);
        }
    };

    const handleClearDatabase = async () => {
        setIsClearing(true);
        try {
            const response = await api.clearDatabase();
            
            // Log the full response for debugging
            console.log('Clear database response:', response);
            
            if (response?.success) {
                const details = response.cleared_models && response.cleared_models.length > 0
                    ? `\n\nCleared models:\n${response.cleared_models.join('\n')}`
                    : '';
                const skippedDetails = response.skipped_models && response.skipped_models.length > 0
                    ? `\n\nSkipped models:\n${response.skipped_models.join('\n')}`
                    : '';
                    
                alert(`Database cleared successfully! All data has been removed except user accounts. The system will now reload.${details}${skippedDetails}`);
                window.location.reload();
            } else {
                const message = response?.message || 'Clear database failed. Please check server logs.';
                const failedDetails = Array.isArray(response?.failed_models) && response.failed_models.length > 0
                    ? `\n\nFailed models:\n${response.failed_models.join('\n')}`
                    : '';
                const clearedDetails = Array.isArray(response?.cleared_models) && response.cleared_models.length > 0
                    ? `\n\nCleared models:\n${response.cleared_models.join('\n')}`
                    : '';
                const skippedDetails = Array.isArray(response?.skipped_models) && response.skipped_models.length > 0
                    ? `\n\nSkipped models:\n${response.skipped_models.join('\n')}`
                    : '';
                    
                alert(`${message}${failedDetails}${clearedDetails}${skippedDetails}`);
            }
        } catch (error) {
            console.error('Error clearing database:', error);
            
            // Try to extract more error details from the response if available
            let errorMessage = 'Error clearing database: ' + error.message;
            if (error.response) {
                console.error('Error response:', error.response);
                if (error.response.data) {
                    errorMessage += '\n\nResponse data: ' + JSON.stringify(error.response.data, null, 2);
                }
                if (error.response.status) {
                    errorMessage += '\n\nStatus code: ' + error.response.status;
                }
            }
            
            alert(errorMessage);
        } finally {
            setIsClearing(false);
            setIsClearModalOpen(false);
        }
    };

    return (
        <div className="admin-setup">
            <div className="admin-header-content">
                <div>
                    <h1 className="admin-page-title">Initial Setup</h1>
                    <p className="admin-page-subtitle">Configure and initialize your system database</p>
                </div>
            </div>

            <div className="admin-section">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Database Management</h2>
                    </div>

                    <div className="admin-setup-content">
                        <div className="warning-box" style={{
                            backgroundColor: '#fff5f5',
                            borderLeft: '4px solid #f56565',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            borderRadius: '8px'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <AlertTriangle size={24} color="#c53030" style={{ flexShrink: 0 }} />
                                <div>
                                    <h3 style={{ color: '#c53030', fontWeight: '700', marginBottom: '0.5rem' }}>Critical Warning</h3>
                                    <p style={{ color: '#742a2a', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        These actions will <strong>permanently delete data</strong> from your database. Use with extreme caution and ensure you have backups if needed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="setup-actions" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Clear Database Section */}
                            <div className="setup-section">
                                <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#dc2626' }}>Clear Database (Keep Users)</h4>
                                <div className="setup-info" style={{ marginBottom: '1rem' }}>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        Removes all data except user accounts:
                                    </p>
                                    <ul style={{ color: '#64748b', fontSize: '0.9rem', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                        <li>✓ Preserves all user accounts and credentials</li>
                                        <li>✓ Deletes: Products, Companies, Blogs, Policies, Quotes, Contacts, Reviews</li>
                                        <li>✓ Resets database sequences and counters</li>
                                    </ul>
                                </div>
                                <button
                                    className="admin-btn admin-btn-warning"
                                    style={{ padding: '1rem 2rem', fontSize: '1rem', alignSelf: 'flex-start', background: '#dc2626' }}
                                    onClick={() => setIsClearModalOpen(true)}
                                    disabled={isClearing}
                                >
                                    {isClearing ? <RefreshCw className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                    <span>{isClearing ? 'Clearing Database...' : 'Clear Database'}</span>
                                </button>
                            </div>

                            <div style={{ border: '1px solid #e2e8f0', margin: '1rem 0' }}></div>

                            {/* Seed Database Section */}
                            <div className="setup-section">
                                <h4 style={{ fontWeight: '600', marginBottom: '1rem', color: '#c53030' }}>Complete Database Reset</h4>
                                <div className="setup-info" style={{ marginBottom: '1rem' }}>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        Complete system reset and initialization:
                                    </p>
                                    <ul style={{ color: '#64748b', fontSize: '0.9rem', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                                        <li>Deletes ALL data including user accounts</li>
                                        <li>Inserts default products and insurance categories</li>
                                        <li>Adds initial blog posts and service descriptions</li>
                                        <li>Creates single default admin account</li>
                                    </ul>
                                </div>
                                <button
                                    className="admin-btn admin-btn-danger"
                                    style={{ padding: '1rem 2rem', fontSize: '1rem', alignSelf: 'flex-start' }}
                                    onClick={() => setIsSeedModalOpen(true)}
                                    disabled={isSeeding}
                                >
                                    {isSeeding ? <RefreshCw className="animate-spin" size={20} /> : <Database size={20} />}
                                    <span>{isSeeding ? 'Seeding Database...' : 'Run Initial Seeding'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SeedDatabaseModal
                isOpen={isSeedModalOpen}
                onClose={() => setIsSeedModalOpen(false)}
                onConfirm={handleSeedDatabase}
                isSubmitting={isSeeding}
            />

            <ClearDatabaseModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleClearDatabase}
                isSubmitting={isClearing}
            />
        </div>
    );
};

export default AdminSetup;
