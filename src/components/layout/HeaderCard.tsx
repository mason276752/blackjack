import React from 'react';

interface HeaderCardProps {
  countingContent: React.ReactNode;
  titleContent: React.ReactNode;
  controlsContent: React.ReactNode;
}

export function HeaderCard({ countingContent, titleContent, controlsContent }: HeaderCardProps) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '20px 24px',
    margin: '0 auto 20px',
    maxWidth: '1800px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    flexWrap: 'wrap',
  };

  const leftSectionStyle: React.CSSProperties = {
    flex: '0 0 auto',
    minWidth: '240px',
    maxWidth: '320px',
  };

  const centerSectionStyle: React.CSSProperties = {
    flex: '1 1 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '6px',
    minWidth: '200px',
  };

  const rightSectionStyle: React.CSSProperties = {
    flex: '0 0 auto',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  };

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    margin: '0 8px',
  };

  return (
    <div style={containerStyle}>
      {/* Left Section: Counting System */}
      <div style={leftSectionStyle}>{countingContent}</div>

      {/* Divider */}
      <div style={dividerStyle} className="header-divider" />

      {/* Center Section: Title + Balance */}
      <div style={centerSectionStyle}>{titleContent}</div>

      {/* Divider */}
      <div style={dividerStyle} className="header-divider" />

      {/* Right Section: Stats + Language */}
      <div style={rightSectionStyle}>{controlsContent}</div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1200px) {
          .header-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
