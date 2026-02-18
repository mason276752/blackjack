import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';

export function CompactStatsDisplay() {
  const { t } = useTranslation('stats');
  const { state } = useGame();

  const stats = state.statistics;
  const winRate = stats.handsPlayed > 0 ? (stats.handsWon / stats.handsPlayed * 100).toFixed(1) : '0.0';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '200px',
      }}
    >
      {/* Title */}
      <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 'bold', marginBottom: '2px' }}>
        📊 {t('sessionStatistics')}
      </div>

      {/* Stats Grid - 2x2 Compact Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '12px' }}>
        {/* Hands Played */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>{t('handsPlayed')}:</span>
          <span style={{ color: 'white', fontWeight: 'bold' }}>{stats.handsPlayed}</span>
        </div>

        {/* Win Rate */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>{t('winRate')}:</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{winRate}%</span>
        </div>

        {/* Net Profit */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>{t('netProfit')}:</span>
          <span style={{ color: stats.netProfit >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
            ${stats.netProfit > 0 ? '+' : ''}{stats.netProfit}
          </span>
        </div>

        {/* Blackjacks */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#94a3b8' }}>{t('blackjacks')}:</span>
          <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{stats.blackjacks}</span>
        </div>
      </div>
    </div>
  );
}
