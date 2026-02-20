import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { BalanceSnapshot } from '../../types/game.types';

interface BalanceHistoryChartProps {
  snapshots: BalanceSnapshot[];
}

export function BalanceHistoryChart({ snapshots }: BalanceHistoryChartProps) {
  const { t } = useTranslation('stats');

  // Prepare data for Recharts
  const chartData = snapshots.map((snapshot) => ({
    handNumber: snapshot.handNumber,
    balance: snapshot.balance,
  }));

  // Calculate starting balance for profit calculation
  const startingBalance = snapshots.length > 0 ? snapshots[0].balance : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const profit = data.balance - startingBalance;
      const profitColor = profit >= 0 ? '#22c55e' : '#ef4444';

      return (
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            borderRadius: '8px',
            padding: '12px',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
            {t('handNumber')}: {data.handNumber}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
            {t('balance')}: ${data.balance}
          </div>
          <div style={{ fontSize: '12px', color: profitColor }}>
            {t('profit')}: {profit >= 0 ? '+' : ''}${profit}
          </div>
        </div>
      );
    }
    return null;
  };

  if (snapshots.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        {t('noBalanceHistory')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey="handNumber"
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
          label={{ value: t('handNumber'), position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
        />
        <YAxis
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
          label={{ value: t('balance'), angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
