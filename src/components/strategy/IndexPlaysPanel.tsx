import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { getActiveStrategySet } from '../../context/gameSelectors';
import { StrategyDeviation } from '../../types/strategy.types';

export function IndexPlaysPanel() {
  const { t } = useTranslation(['strategy', 'count']);
  const { state } = useGame();

  const activeStrategySet = useMemo(
    () => getActiveStrategySet(state),
    [state.countingSystem.id]
  );

  // Group deviations by category for better organization
  const groupedDeviations = useMemo(() => {
    const groups: Record<string, StrategyDeviation[]> = {
      insurance: [],
      standing: [],
      doubling: [],
      splitting: [],
      other: [],
    };

    activeStrategySet.deviations.forEach((dev) => {
      if (dev.deviationAction === 'take_insurance') {
        groups.insurance.push(dev);
      } else if (dev.deviationAction === 'S' || dev.deviationAction === 'SU') {
        groups.standing.push(dev);
      } else if (dev.deviationAction === 'DH' || dev.deviationAction === 'DS') {
        groups.doubling.push(dev);
      } else if (dev.deviationAction === 'SP') {
        groups.splitting.push(dev);
      } else {
        groups.other.push(dev);
      }
    });

    return groups;
  }, [activeStrategySet]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '2px solid rgba(255, 255, 255, 0.1)',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: '8px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '4px',
  };

  const infoStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
  };

  const tableContainerStyle: React.CSSProperties = {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '500px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
    color: '#e5e7eb',
  };

  const thStyle: React.CSSProperties = {
    backgroundColor: '#1e293b',
    color: '#8b5cf6',
    padding: '10px 8px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #8b5cf6',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };

  const tdStyle: React.CSSProperties = {
    padding: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const categoryHeaderStyle: React.CSSProperties = {
    backgroundColor: '#1e293b',
    color: '#fbbf24',
    padding: '8px',
    fontWeight: 'bold',
    fontSize: '13px',
    borderTop: '2px solid #8b5cf6',
  };

  const actionBadgeStyle = (action: string): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '11px',
    };

    switch (action) {
      case 'H':
        return { ...baseStyle, backgroundColor: '#fbbf24', color: '#000' };
      case 'S':
        return { ...baseStyle, backgroundColor: '#22c55e', color: '#000' };
      case 'DH':
      case 'DS':
        return { ...baseStyle, backgroundColor: '#3b82f6', color: '#fff' };
      case 'SP':
        return { ...baseStyle, backgroundColor: '#a855f7', color: '#fff' };
      case 'SU':
        return { ...baseStyle, backgroundColor: '#ef4444', color: '#fff' };
      case 'take_insurance':
        return { ...baseStyle, backgroundColor: '#06b6d4', color: '#fff' };
      default:
        return { ...baseStyle, backgroundColor: '#6b7280', color: '#fff' };
    }
  };

  const thresholdStyle = (threshold: number): React.CSSProperties => ({
    color: threshold >= 0 ? '#22c55e' : '#ef4444',
    fontWeight: 'bold',
  });

  const renderDeviationRows = (deviations: StrategyDeviation[]) => {
    return deviations.map((dev, idx) => (
      <tr key={idx}>
        <td style={tdStyle}>{dev.hand}</td>
        <td style={tdStyle}>{dev.dealer}</td>
        <td style={tdStyle}>
          <span style={actionBadgeStyle(dev.basicAction)}>
            {dev.basicAction}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={actionBadgeStyle(dev.deviationAction)}>
            {dev.deviationAction === 'take_insurance' ? 'INS' : dev.deviationAction}
          </span>
        </td>
        <td style={{ ...tdStyle, ...thresholdStyle(dev.threshold) }}>
          {dev.threshold > 0 ? `+${dev.threshold}` : dev.threshold}
        </td>
        <td style={{ ...tdStyle, fontSize: '11px', color: '#9ca3af' }}>
          {dev.description}
        </td>
      </tr>
    ));
  };

  const countType = activeStrategySet.usesTrueCount
    ? t('count:trueCount', 'True Count')
    : t('count:runningCount', 'Running Count');

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          {t('indexPlaysTitle', 'Index Plays')} - {t(`count:strategyName.${activeStrategySet.id}`)}
        </div>
        <div style={subtitleStyle}>
          {t('count:systemName.' + state.countingSystem.id)} {t('indexPlaysSystem', 'System')}
        </div>
        <div style={infoStyle}>
          {activeStrategySet.deviations.length} {t('count:indexPlays', 'index plays')} ({countType})
        </div>
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>{t('indexHand', 'Hand')}</th>
              <th style={thStyle}>{t('indexDealer', 'Dealer')}</th>
              <th style={thStyle}>{t('indexBasic', 'Basic')}</th>
              <th style={thStyle}>{t('indexDeviation', 'Deviation')}</th>
              <th style={thStyle}>{t('indexThreshold', 'Threshold')}</th>
              <th style={thStyle}>{t('indexDescription', 'Description')}</th>
            </tr>
          </thead>
          <tbody>
            {groupedDeviations.insurance.length > 0 && (
              <>
                <tr>
                  <td colSpan={6} style={categoryHeaderStyle}>
                    {t('indexCategoryInsurance', 'Insurance')}
                  </td>
                </tr>
                {renderDeviationRows(groupedDeviations.insurance)}
              </>
            )}

            {groupedDeviations.standing.length > 0 && (
              <>
                <tr>
                  <td colSpan={6} style={categoryHeaderStyle}>
                    {t('indexCategoryStanding', 'Standing Deviations')}
                  </td>
                </tr>
                {renderDeviationRows(groupedDeviations.standing)}
              </>
            )}

            {groupedDeviations.doubling.length > 0 && (
              <>
                <tr>
                  <td colSpan={6} style={categoryHeaderStyle}>
                    {t('indexCategoryDoubling', 'Doubling Deviations')}
                  </td>
                </tr>
                {renderDeviationRows(groupedDeviations.doubling)}
              </>
            )}

            {groupedDeviations.splitting.length > 0 && (
              <>
                <tr>
                  <td colSpan={6} style={categoryHeaderStyle}>
                    {t('indexCategorySplitting', 'Splitting Deviations')}
                  </td>
                </tr>
                {renderDeviationRows(groupedDeviations.splitting)}
              </>
            )}

            {groupedDeviations.other.length > 0 && (
              <>
                <tr>
                  <td colSpan={6} style={categoryHeaderStyle}>
                    {t('indexCategoryOther', 'Other Deviations')}
                  </td>
                </tr>
                {renderDeviationRows(groupedDeviations.other)}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
