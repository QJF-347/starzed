import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const ImageUpload = ({ 
  value, 
  onChange, 
  onRemove, 
  className = '',
  placeholder = 'Drag & drop image here or click to browse',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  showPreview = true,
  disabled = false,
  storageType = 'base64', // 'base64' or 'url'
  onUploadStart,
  onUploadSuccess,
  onUploadError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  // Handle file selection
  const handleFileSelect = useCallback(async (file) => {
    setError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    
    // Start upload process
    if (onUploadStart) onUploadStart();
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      if (storageType === 'base64') {
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          onChange(result);
          setIsUploading(false);
          setUploadProgress(100);
          if (onUploadSuccess) onUploadSuccess(result);
        };
        reader.onerror = () => {
          setError('Failed to read file');
          setIsUploading(false);
          if (onUploadError) onUploadError('Failed to read file');
        };
        reader.readAsDataURL(file);
      } else {
        // For URL-based storage, upload to server
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            // Convert base64 to blob for upload
            const base64Data = e.target.result.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: file.type });
            
            // Create file object from blob
            const fileObj = new File([blob], file.name, { type: file.type });
            
            // Upload to server
            const response = await apiService.uploadFile(fileObj);
            
            if (response.success) {
              onChange(response.data.url);
              setIsUploading(false);
              setUploadProgress(100);
              if (onUploadSuccess) onUploadSuccess(response.data);
            } else {
              throw new Error(response.message || 'Upload failed');
            }
          } catch (error) {
            setError('Upload failed. Please try again.');
            setIsUploading(false);
            if (onUploadError) onUploadError(error);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setIsUploading(false);
      if (onUploadError) onUploadError(err);
    }
  }, [onChange, maxSize, storageType, onUploadStart, onUploadSuccess, onUploadError]);

  // Handle drag and drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle paste event
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
          break;
        }
      }
    }
  }, [handleFileSelect]);

  // Handle click on upload area
  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Add paste event listener on mount
  React.useEffect(() => {
    const element = fileInputRef.current?.parentElement;
    if (element && !disabled) {
      element.addEventListener('paste', handlePaste);
      return () => {
        element.removeEventListener('paste', handlePaste);
      };
    }
  }, [handlePaste, disabled]);

  // Get image info for display
  const getImageInfo = () => {
    if (!value) return null;
    
    if (value.startsWith('data:')) {
      const matches = value.match(/^data:(.+?);base64,/);
      if (matches && matches[1]) {
        return { type: 'Base64', format: matches[1].split('/')[1] };
      }
    } else if (value.startsWith('http')) {
      return { type: 'URL', format: 'External' };
    }
    
    return { type: 'Unknown', format: 'Unknown' };
  };

  const imageInfo = getImageInfo();

  return (
    <div className={`image-upload-container ${className}`}>
      <div
        className={`image-upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${isUploading ? 'loading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        {value && showPreview ? (
          <div className="image-preview">
            <img 
              src={value} 
              alt="Preview" 
              className="preview-image"
              onError={(e) => {
                e.target.style.display = 'none';
                setError('Failed to load image preview');
              }}
            />
            {imageInfo && (
              <div className="image-info">
                <span className="image-info-badge">{imageInfo.type}</span>
                {imageInfo.format && (
                  <span className="image-info-badge">{imageInfo.format.toUpperCase()}</span>
                )}
              </div>
            )}
            {!disabled && !isUploading && (
              <button
                type="button"
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  setError('');
                }}
                title="Remove image"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            {isUploading ? (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p>Uploading... {uploadProgress}%</p>
              </div>
            ) : (
              <>
                <Upload size={32} className="upload-icon" />
                <div className="upload-text">
                  <p>{placeholder}</p>
                  <small>or copy & paste from clipboard</small>
                </div>
              </>
            )}
          </div>
        )}
        
        {isUploading && (
          <div className="upload-overlay">
            <div className="upload-spinner"></div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="image-upload-error">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {!error && value && (
        <div className="image-upload-success">
          <span>Image uploaded successfully</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
