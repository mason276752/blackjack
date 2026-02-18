import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';

export function StatsPanel() {
  const { t } = useTranslation(['stats', 'common']);
  const { state, dispatch } = useGame();

  const stats = state.statistics;
  const winRate = stats.handsPlayed > 0 ? (stats.handsWon / stats.handsPlayed * 100).toFixed(1) : '0.0';
  const avgBet = stats.handsPlayed > 0 ? (stats.totalWagered / stats.handsPlayed).toFixed(2) : '0.00';

  return (
    <div style={{ position: 'relative', minWidth: '200px' }}>
      {/* Toggle button - always visible */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_STATS_PANEL' })}
        style={{
          padding: '8px 16px',
          backgroundColor: state.showStatsPanel ? '#8b5cf6' : '#374151',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        {state.showStatsPanel ? '✕' : '📊'} {t('stats:stats')}
      </button>

      {/* Stats panel - absolute positioning to avoid layout shift */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          minWidth: '280px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #8b5cf6',
          borderRadius: '8px',
          padding: state.showStatsPanel ? '16px' : '0',
          marginTop: '8px',
          maxHeight: state.showStatsPanel ? '500px' : '0',
          overflow: 'hidden',
          opacity: state.showStatsPanel ? 1 : 0,
          transition: 'max-height 0.3s ease, opacity 0.2s ease, padding 0.3s ease',
          zIndex: 100,
          pointerEvents: state.showStatsPanel ? 'auto' : 'none',
        }}
      >
        <h3 style={{ color: '#8b5cf6', margin: '0 0 12px 0' }}>{t('stats:sessionStatistics')}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:handsPlayed')}:</div>
          <div style={{ color: 'white', fontWeight: 'bold' }}>{stats.handsPlayed}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:winRate')}:</div>
          <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{winRate}%</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:handsWon')}:</div>
          <div style={{ color: '#22c55e', fontWeight: 'bold' }}>{stats.handsWon}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:handsLost')}:</div>
          <div style={{ color: '#ef4444', fontWeight: 'bold' }}>{stats.handsLost}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:blackjacks')}:</div>
          <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>{stats.blackjacks}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:busts')}:</div>
          <div style={{ color: '#ef4444', fontWeight: 'bold' }}>{stats.busts}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:totalWagered')}:</div>
          <div style={{ color: 'white', fontWeight: 'bold' }}>${stats.totalWagered}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:totalWon')}:</div>
          <div style={{ color: 'white', fontWeight: 'bold' }}>${stats.totalWon}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:netProfit')}:</div>
          <div style={{ color: stats.netProfit >= 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
            ${stats.netProfit > 0 ? '+' : ''}{stats.netProfit}
          </div>
        </div>

        <div>
          <div style={{ color: '#94a3b8' }}>{t('stats:avgBet')}:</div>
          <div style={{ color: 'white', fontWeight: 'bold' }}>${avgBet}</div>
        </div>
        </div>
      </div>
    </div>
  );
}
