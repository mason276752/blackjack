import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { StrategyTable } from './StrategyTable';
import {
  getHardHandTable,
  getSoftHandTable,
  getPairTable,
} from '../../lib/strategy/StrategyTableData';
import { HandEvaluator } from '../../lib/hand/HandEvaluator';

type TableType = 'hard' | 'soft' | 'pairs';

export function StrategyPanel() {
  const { t } = useTranslation('strategy');
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<TableType>('hard');

  // Get table data based on current rules
  const hardHandTable = useMemo(() => getHardHandTable(state.rules), [state.rules]);
  const softHandTable = useMemo(() => getSoftHandTable(state.rules), [state.rules]);
  const pairTable = useMemo(() => getPairTable(state.rules), [state.rules]);

  // Calculate highlighted cell based on current game state
  const highlightedCell = useMemo(() => {
    // Only highlight during player turn with active hand
    if (state.phase !== 'player_turn' || !state.activeHandIndex) {
      return null;
    }

    const activeHand = state.hands[state.activeHandIndex];
    if (!activeHand || activeHand.status !== 'active' || !state.dealerHand.length) {
      return null;
    }

    const dealerUpCard = state.dealerHand[0];
    const dealerValue = dealerUpCard.rank === 'A' ? 'A' : String(Math.min(10, Number(dealerUpCard.rank) || 10));
    const dealerIndex = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'].indexOf(dealerValue);

    if (dealerIndex === -1) return null;

    // Check for pairs (only on initial 2 cards)
    if (activeHand.cards.length === 2) {
      const firstRank = activeHand.cards[0].rank;
      const secondRank = activeHand.cards[1].rank;
      const firstValue = firstRank === 'A' ? 'A' : String(Math.min(10, Number(firstRank) || 10));
      const secondValue = secondRank === 'A' ? 'A' : String(Math.min(10, Number(secondRank) || 10));

      if (firstValue === secondValue) {
        const pairValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
        const pairIndex = pairValues.indexOf(firstValue);
        if (pairIndex !== -1) {
          return {
            tableType: 'pairs' as TableType,
            rowIndex: pairIndex,
            colIndex: dealerIndex,
          };
        }
      }
    }

    // Check for soft hands
    if (HandEvaluator.isSoft(activeHand.cards)) {
      const softHands = ['A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];
      let nonAceValue = 0;

      for (const card of activeHand.cards) {
        if (card.rank !== 'A') {
          const cardValue = Math.min(10, Number(card.rank) || 10);
          nonAceValue += cardValue;
        }
      }

      // For soft hands, find the equivalent A + nonAceValue representation
      if (nonAceValue >= 2 && nonAceValue <= 9) {
        const softHandKey = `A${nonAceValue}`;
        const softIndex = softHands.indexOf(softHandKey);
        if (softIndex !== -1) {
          return {
            tableType: 'soft' as TableType,
            rowIndex: softIndex,
            colIndex: dealerIndex,
          };
        }
      }
    }

    // Hard hands (5-21)
    const handValue = activeHand.value;
    if (handValue >= 5 && handValue <= 21) {
      return {
        tableType: 'hard' as TableType,
        rowIndex: handValue - 5, // Row 0 = total 5
        colIndex: dealerIndex,
      };
    }

    return null;
  }, [state.phase, state.activeHandIndex, state.hands, state.dealerHand]);

  // Auto-switch to the correct tab when highlighting changes
  React.useEffect(() => {
    if (highlightedCell) {
      setActiveTab(highlightedCell.tableType);
    }
  }, [highlightedCell]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: '8px',
  };

  const rulesInfoStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '12px',
  };

  const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '8px',
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: isActive ? '#8b5cf6' : 'transparent',
    color: isActive ? 'white' : '#9ca3af',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
  });

  const tableContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'hidden',
  };

  const legendStyle: React.CSSProperties = {
    marginTop: '12px',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '6px',
    fontSize: '11px',
    color: '#d1d5db',
  };

  const legendItemStyle: React.CSSProperties = {
    display: 'inline-block',
    marginRight: '12px',
    marginBottom: '4px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>{t('title', 'Basic Strategy')}</div>
        <div style={rulesInfoStyle}>
          {state.rules.dealerHitsSoft17 ? 'H17' : 'S17'} |
          {state.rules.doubleAfterSplit ? ' DAS' : ' No DAS'} |
          {` ${state.rules.deckCount}D`}
        </div>
      </div>

      <div style={tabContainerStyle}>
        <button
          style={getTabStyle(activeTab === 'hard')}
          onClick={() => setActiveTab('hard')}
        >
          {t('tableHard', 'Hard Totals')}
        </button>
        <button
          style={getTabStyle(activeTab === 'soft')}
          onClick={() => setActiveTab('soft')}
        >
          {t('tableSoft', 'Soft Totals')}
        </button>
        <button
          style={getTabStyle(activeTab === 'pairs')}
          onClick={() => setActiveTab('pairs')}
        >
          {t('tablePairs', 'Pairs')}
        </button>
      </div>

      <div style={tableContainerStyle}>
        {activeTab === 'hard' && (
          <StrategyTable
            tableData={hardHandTable}
            highlightedCell={
              highlightedCell?.tableType === 'hard'
                ? { rowIndex: highlightedCell.rowIndex, colIndex: highlightedCell.colIndex }
                : null
            }
          />
        )}
        {activeTab === 'soft' && (
          <StrategyTable
            tableData={softHandTable}
            highlightedCell={
              highlightedCell?.tableType === 'soft'
                ? { rowIndex: highlightedCell.rowIndex, colIndex: highlightedCell.colIndex }
                : null
            }
          />
        )}
        {activeTab === 'pairs' && (
          <StrategyTable
            tableData={pairTable}
            highlightedCell={
              highlightedCell?.tableType === 'pairs'
                ? { rowIndex: highlightedCell.rowIndex, colIndex: highlightedCell.colIndex }
                : null
            }
          />
        )}
      </div>

      <div style={legendStyle}>
        <div style={legendItemStyle}>
          <span style={{ color: '#fbbf24' }}>H</span> = {t('legendH', 'Hit')}
        </div>
        <div style={legendItemStyle}>
          <span style={{ color: '#22c55e' }}>S</span> = {t('legendS', 'Stand')}
        </div>
        <div style={legendItemStyle}>
          <span style={{ color: '#3b82f6' }}>D</span> = {t('legendD', 'Double')}
        </div>
        <div style={legendItemStyle}>
          <span style={{ color: '#a855f7' }}>SP</span> = {t('legendSP', 'Split')}
        </div>
        <div style={legendItemStyle}>
          <span style={{ color: '#ef4444' }}>SU</span> = {t('legendSU', 'Surrender')}
        </div>
      </div>
    </div>
  );
}
