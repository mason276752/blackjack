import React from 'react';
import { useTranslation } from 'react-i18next';

interface CountingSystemWarningProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CountingSystemWarning({ isOpen, onConfirm, onCancel }: CountingSystemWarningProps) {
  const { t } = useTranslation('count');

  if (!isOpen) return null;

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: '12px',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#d1d5db',
    marginBottom: '24px',
    lineHeight: '1.5',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: '1px solid rgba(156, 163, 175, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const confirmButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  return (
    <div style={backdropStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>{t('changeWarningTitle', 'Change Counting System?')}</div>
        <div style={messageStyle}>
          {t('changeWarningMessage', 'Changing the counting system will reset the running count and true count to zero. Continue?')}
        </div>
        <div style={buttonContainerStyle}>
          <button style={cancelButtonStyle} onClick={onCancel}>
            {t('cancel', 'Cancel')}
          </button>
          <button style={confirmButtonStyle} onClick={onConfirm}>
            {t('confirm', 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
