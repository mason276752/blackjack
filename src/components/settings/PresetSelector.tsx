import React from 'react';
import { useTranslation } from 'react-i18next';

export type PresetType = 'vegas' | 'single' | 'atlantic' | 'custom';

interface PresetSelectorProps {
  selectedPreset: PresetType;
  onSelectPreset: (preset: PresetType) => void;
}

export function PresetSelector({ selectedPreset, onSelectPreset }: PresetSelectorProps) {
  const { t } = useTranslation('rules');

  const presets: Array<{ value: PresetType; label: string; desc: string }> = [
    { value: 'vegas', label: t('vegasStrip'), desc: t('vegasStripDesc') },
    { value: 'single', label: t('singleDeck'), desc: t('singleDeckDesc') },
    { value: 'atlantic', label: t('atlanticCity'), desc: t('atlanticCityDesc') },
    { value: 'custom', label: t('custom'), desc: '' },
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📋 {t('presetsSection')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onSelectPreset(preset.value)}
            style={{
              padding: '12px',
              backgroundColor: selectedPreset === preset.value ? '#374151' : '#1e293b',
              border: selectedPreset === preset.value ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {selectedPreset === preset.value && (
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
              )}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{preset.label}</div>
              {preset.desc && <div style={{ fontSize: '13px', color: '#9ca3af' }}>{preset.desc}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
