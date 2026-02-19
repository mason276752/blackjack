import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { calculateRTP, getRTPCategory, compareRTPToExpected } from '../../lib/stats/rtpCalculator';
import { HouseEdgeCalculator } from '../../lib/strategy/HouseEdgeCalculator';

export function CompactStatsDisplay() {
  const { t } = useTranslation('stats');
  const { state } = useGame();

  const stats = state.statistics;
  // Calculate win rate excluding pushes (only count wins vs losses)
  const decisiveHands = stats.handsWon + stats.handsLost;
  const winRate = decisiveHands > 0 ? (stats.handsWon / decisiveHands * 100).toFixed(1) : '0.0';

  // Calculate RTP
  const rtpData = useMemo(() => calculateRTP(stats), [stats]);
  const rtpCategory = useMemo(() => getRTPCategory(rtpData.rtp), [rtpData.rtp]);

  // Compare to expected RTP
  const houseEdge = useMemo(() => HouseEdgeCalculator.calculateHouseEdge(state.rules), [state.rules]);
  const rtpComparison = useMemo(
    () => compareRTPToExpected(rtpData.rtp, houseEdge),
    [rtpData.rtp, houseEdge]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '260px',
        maxWidth: '320px',
        width: '100%',
        padding: '10px 12px',
        backgroundColor: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '8px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      }}
    >
      {/* Header with title and RTP badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: 'bold' }}>
          📊 {t('sessionStatistics')}
        </div>
        <div style={{
          padding: '4px 8px',
          backgroundColor: stats.handsPlayed > 0 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(55, 65, 81, 0.3)',
          border: `1px solid ${stats.handsPlayed > 0 ? rtpCategory.color : '#4b5563'}`,
          borderRadius: '4px',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            RTP
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: stats.handsPlayed > 0 ? rtpCategory.color : '#6b7280',
            lineHeight: 1,
          }}>
            {rtpData.rtp.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Expected RTP line */}
      <div style={{
        fontSize: '10px',
        color: '#94a3b8',
        marginBottom: '6px',
        paddingLeft: '2px',
      }}>
        {t('expected')}: <span style={{ color: '#cbd5e1' }}>{(100 - houseEdge).toFixed(2)}%</span>
        {stats.handsPlayed > 0 && rtpComparison.difference !== 0 && (
          <span style={{
            color: rtpComparison.performance === 'above' ? '#22c55e' : '#ef4444',
            marginLeft: '6px',
            fontWeight: 'bold',
          }}>
            ({rtpComparison.difference > 0 ? '+' : ''}{rtpComparison.difference.toFixed(2)}%)
          </span>
        )}
      </div>

      {/* Stats Grid - 2x2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 12px',
        fontSize: '12px',
        paddingTop: '6px',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        {/* Hands Played */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>{t('handsPlayed')}</span>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{stats.handsPlayed}</span>
        </div>

        {/* Win Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>{t('winRate')}</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>{winRate}%</span>
        </div>

        {/* Net Profit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>{t('netProfit')}</span>
          <span style={{
            color: stats.netProfit >= 0 ? '#22c55e' : '#ef4444',
            fontWeight: 'bold',
            fontSize: '14px',
          }}>
            ${stats.netProfit > 0 ? '+' : ''}{stats.netProfit}
          </span>
        </div>

        {/* Blackjacks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>{t('blackjacks')}</span>
          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>{stats.blackjacks}</span>
        </div>
      </div>
    </div>
  );
}
