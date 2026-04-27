import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeClass = () => {
    switch(type) {
      case 'danger': return 'confirm-modal-danger';
      case 'warning': return 'confirm-modal-warning';
      case 'info': return 'confirm-modal-info';
      default: return 'confirm-modal-danger';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'danger': return <AlertTriangle className="confirm-modal-icon-danger" />;
      case 'warning': return <AlertTriangle className="confirm-modal-icon-warning" />;
      case 'info': return <AlertTriangle className="confirm-modal-icon-info" />;
      default: return <AlertTriangle className="confirm-modal-icon-danger" />;
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleBackdropClick}>
      <div className="confirm-modal">
        <div className="confirm-modal-header">
          <button className="confirm-modal-close" onClick={onClose}>
            <X className="confirm-modal-close-icon" />
          </button>
        </div>
        
        <div className="confirm-modal-body">
          <div className="confirm-modal-icon-container">
            {getIcon()}
          </div>
          
          <h3 className="confirm-modal-title">{title}</h3>
          
          {message && (
            <p className="confirm-modal-message">{message}</p>
          )}
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            className="confirm-modal-btn confirm-modal-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn confirm-modal-btn-confirm ${getTypeClass()}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
