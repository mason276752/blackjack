import React from 'react';
import { useTranslation } from 'react-i18next';

interface RulesConfigButtonProps {
  onClick: () => void;
}

export function RulesConfigButton({ onClick }: RulesConfigButtonProps) {
  const { t } = useTranslation('rules');

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      <span style={{ fontSize: '16px' }}>⚙️</span>
      {t('rulesButton')}
    </button>
  );
}
