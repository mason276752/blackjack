import React from 'react';

interface RuleInputProps {
  type: 'number' | 'select' | 'toggle' | 'checkbox' | 'range';
  label: string;
  value: number | string | boolean;
  onChange: (value: number | string | boolean) => void;
  options?: Array<{ value: number | string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function RuleInput({
  type,
  label,
  value,
  onChange,
  options,
  min,
  max,
  step = 1,
  disabled = false,
}: RuleInputProps) {
  const baseStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: disabled ? '#1e293b' : '#334155',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  if (type === 'number' || type === 'select') {
    return (
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#e2e8f0' }}>
          {label}
        </label>
        <select
          value={String(value)}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          style={{ ...baseStyle, width: '100%' }}
          disabled={disabled}
        >
          {options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'toggle') {
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#e2e8f0' }}>
          {label}
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {options?.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => !disabled && onChange(opt.value)}
              disabled={disabled}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: value === opt.value ? '#3b82f6' : '#334155',
                color: 'white',
                border: value === opt.value ? '2px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: value === opt.value ? 'bold' : 'normal',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          style={{
            width: '18px',
            height: '18px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            accentColor: '#3b82f6',
          }}
        />
        <label style={{ fontSize: '14px', color: '#e2e8f0', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {label}
        </label>
      </div>
    );
  }

  if (type === 'range') {
    const percentage = ((Number(value) - (min || 0)) / ((max || 1) - (min || 0))) * 100;
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#e2e8f0' }}>
          {label}: {(Number(value) * 100).toFixed(0)}%
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            style={{
              flex: 1,
              height: '6px',
              accentColor: '#3b82f6',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}
