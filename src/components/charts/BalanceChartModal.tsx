import { useTranslation } from 'react-i18next';
import { BalanceHistory } from '../../types/game.types';
import { BalanceHistoryChart } from './BalanceHistoryChart';

interface BalanceChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceHistory: BalanceHistory;
  currentBalance: number;
}

export function BalanceChartModal({ isOpen, onClose, balanceHistory, currentBalance }: BalanceChartModalProps) {
  const { t } = useTranslation('stats');

  if (!isOpen) return null;

  const { snapshots } = balanceHistory;
  const hasData = snapshots.length > 0;

  // Calculate statistics
  const startingBalance = hasData ? snapshots[0].balance : currentBalance;
  const totalChange = currentBalance - startingBalance;
  const peakBalance = hasData ? Math.max(...snapshots.map((s) => s.balance)) : currentBalance;
  const lowestBalance = hasData ? Math.min(...snapshots.map((s) => s.balance)) : currentBalance;
  const dataPoints = snapshots.length;

  // Overlay backdrop
  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  // Modal container
  const modalStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 41, 59, 0.98)',
    border: '2px solid rgba(139, 92, 246, 0.5)',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  };

  // Header
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#8b5cf6',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const closeButtonStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#94a3b8',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s',
  };

  // Statistics grid
  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
  };

  // Footer note
  const footerStyle: React.CSSProperties = {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#64748b',
    fontStyle: 'italic',
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleStyle}>
            📊 {t('balanceHistory')}
          </div>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.2)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            ×
          </button>
        </div>

        {/* Statistics Summary */}
        {hasData && (
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t('startingBalance')}</div>
              <div style={statValueStyle}>${startingBalance}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t('currentBalance')}</div>
              <div style={statValueStyle}>${currentBalance}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t('totalChange')}</div>
              <div style={{ ...statValueStyle, color: totalChange >= 0 ? '#22c55e' : '#ef4444' }}>
                {totalChange >= 0 ? '+' : ''}${totalChange}
              </div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t('peakBalance')}</div>
              <div style={{ ...statValueStyle, color: '#22c55e' }}>${peakBalance}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t('lowestBalance')}</div>
              <div style={{ ...statValueStyle, color: '#ef4444' }}>${lowestBalance}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>{t('dataPoints')}</div>
              <div style={statValueStyle}>{dataPoints}</div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <BalanceHistoryChart snapshots={snapshots} />
        </div>

        {/* Footer Note */}
        {hasData && (
          <div style={footerStyle}>
            {dataPoints >= balanceHistory.maxSize
              ? t('maxReached', { max: balanceHistory.maxSize })
              : t('chartNote', { count: dataPoints, max: balanceHistory.maxSize })}
          </div>
        )}
      </div>
    </div>
  );
}
