import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '8px 16px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s',
      }}
      aria-label="Switch language"
      title={i18n.language === 'zh-TW' ? 'Switch to English' : '切換至繁體中文'}
    >
      <span style={{ fontSize: '18px' }}>🌐</span>
      {i18n.language === 'zh-TW' ? 'EN' : '繁中'}
    </button>
  );
}
