import React from 'react';
import { useTranslation } from 'react-i18next';
import { GameRules } from '../../types/game.types';
import { RuleInput } from './RuleInput';

interface CustomRulesFormProps {
  rules: GameRules;
  onChange: (field: keyof GameRules, value: any) => void;
  disabled: boolean;
}

export function CustomRulesForm({ rules, onChange, disabled }: CustomRulesFormProps) {
  const { t } = useTranslation('rules');

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {/* Basic Rules Section */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>📊 {t('basicSection')}</div>

        <RuleInput
          type="select"
          label={t('deckCount')}
          value={rules.deckCount}
          onChange={(value) => onChange('deckCount', value)}
          options={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
          ]}
          disabled={disabled}
        />

        <RuleInput
          type="toggle"
          label={t('dealerRule')}
          value={rules.dealerHitsSoft17}
          onChange={(value) => onChange('dealerHitsSoft17', value)}
          options={[
            { value: false, label: t('dealerS17') },
            { value: true, label: t('dealerH17') },
          ]}
          disabled={disabled}
        />

        <RuleInput
          type="toggle"
          label={t('blackjackPayout')}
          value={rules.blackjackPayout}
          onChange={(value) => onChange('blackjackPayout', value)}
          options={[
            { value: 1.5, label: t('payout3to2') },
            { value: 1.2, label: t('payout6to5') },
          ]}
          disabled={disabled}
        />

        <RuleInput
          type="range"
          label={t('penetration')}
          value={rules.penetration}
          onChange={(value) => onChange('penetration', value)}
          min={0.5}
          max={0.9}
          step={0.05}
          disabled={disabled}
        />
      </div>

      {/* Doubling Section */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>✕ {t('doublingSection')}</div>

        <RuleInput
          type="checkbox"
          label={t('doubleAfterSplit')}
          value={rules.doubleAfterSplit}
          onChange={(value) => onChange('doubleAfterSplit', value)}
          disabled={disabled}
        />

        <RuleInput
          type="select"
          label={t('doubleOn')}
          value={rules.doubleOn}
          onChange={(value) => onChange('doubleOn', value)}
          options={[
            { value: 'any', label: t('doubleAny') },
            { value: '9-11', label: t('double9to11') },
            { value: '10-11', label: t('double10to11') },
          ]}
          disabled={disabled}
        />
      </div>

      {/* Splitting Section */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>✂ {t('splittingSection')}</div>

        <RuleInput
          type="select"
          label={t('maxSplits')}
          value={rules.maxSplits}
          onChange={(value) => onChange('maxSplits', value)}
          options={[
            { value: 0, label: '0' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
          ]}
          disabled={disabled}
        />

        <RuleInput
          type="checkbox"
          label={t('resplitAces')}
          value={rules.canResplitAces}
          onChange={(value) => onChange('canResplitAces', value)}
          disabled={disabled}
        />

        <RuleInput
          type="checkbox"
          label={t('hitSplitAces')}
          value={rules.canHitSplitAces}
          onChange={(value) => onChange('canHitSplitAces', value)}
          disabled={disabled}
        />
      </div>

      {/* Other Options Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={sectionTitleStyle}>⚙ {t('otherSection')}</div>

        <RuleInput
          type="checkbox"
          label={t('lateSurrender')}
          value={rules.lateSurrender}
          onChange={(value) => onChange('lateSurrender', value)}
          disabled={disabled}
        />

        <RuleInput
          type="checkbox"
          label={t('insurance')}
          value={rules.insuranceAllowed}
          onChange={(value) => onChange('insuranceAllowed', value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
