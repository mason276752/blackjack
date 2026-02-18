import React from 'react';
import { TableData } from '../../lib/strategy/StrategyTableData';
import { getActionColor } from '../../lib/strategy/StrategyTableData';

interface StrategyTableProps {
  tableData: TableData;
  highlightedCell?: {
    rowIndex: number;
    colIndex: number;
  } | null;
}

export const StrategyTable = React.memo(function StrategyTable({ tableData, highlightedCell }: StrategyTableProps) {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    fontWeight: 'bold',
    tableLayout: 'fixed',
  };

  const headerCellStyle: React.CSSProperties = {
    backgroundColor: '#374151',
    color: '#fbbf24',
    padding: '8px 4px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 2,
    fontWeight: 'bold',
    fontSize: '12px',
  };

  const rowHeaderStyle: React.CSSProperties = {
    backgroundColor: '#374151',
    color: '#fbbf24',
    padding: '8px 10px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    left: 0,
    zIndex: 1,
    fontWeight: 'bold',
    fontSize: '12px',
  };

  const cellBaseStyle: React.CSSProperties = {
    padding: '8px 4px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  };

  const highlightedStyle: React.CSSProperties = {
    boxShadow: '0 0 0 3px #fbbf24 inset',
    animation: 'pulse 2s ease-in-out infinite',
  };

  const containerStyle: React.CSSProperties = {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '100%',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
      <div style={containerStyle}>
        <table style={tableStyle} role="table" aria-label="Basic strategy table">
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, left: 0, zIndex: 3 }} scope="col"></th>
              {tableData.headers.map((header, index) => (
                <th key={index} style={headerCellStyle} scope="col" aria-label={`Dealer shows ${header}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th style={rowHeaderStyle} scope="row" aria-label={`Player hand ${row.label}`}>{row.label}</th>
                {row.cells.map((action, colIndex) => {
                  const isHighlighted =
                    highlightedCell &&
                    highlightedCell.rowIndex === rowIndex &&
                    highlightedCell.colIndex === colIndex;

                  const cellStyle: React.CSSProperties = {
                    ...cellBaseStyle,
                    backgroundColor: getActionColor(action),
                    ...(isHighlighted ? highlightedStyle : {}),
                  };

                  return (
                    <td
                      key={colIndex}
                      style={cellStyle}
                      aria-label={`Action: ${action}${isHighlighted ? ' (current hand)' : ''}`}
                    >
                      {action}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
