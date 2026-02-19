import React, { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface GameLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  children: React.ReactNode;
}

type PanelType = 'strategy' | 'rules' | null;

export function GameLayout({ leftPanel, rightPanel, children }: GameLayoutProps) {
  const breakpoint = useBreakpoint();
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  // Desktop layout (≥1400px)
  if (breakpoint === 'desktop') {
    const layoutStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: '520px 1fr 400px',
      gridTemplateRows: '1fr',
      gap: '20px',
      maxWidth: '1940px',
      margin: '0 auto',
      padding: '0 20px',
      alignItems: 'start',
    };

    const panelStyle: React.CSSProperties = {
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 200px)',
    };

    const centerStyle: React.CSSProperties = {
      minWidth: '600px',
    };

    return (
      <div style={layoutStyle}>
        <div style={panelStyle} data-panel="left">
          {leftPanel}
        </div>
        <div style={centerStyle} data-panel="center">
          {children}
        </div>
        <div style={panelStyle} data-panel="right">
          {rightPanel}
        </div>
      </div>
    );
  }

  // Tablet layout (900px - 1399px)
  if (breakpoint === 'tablet') {
    const containerStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: '1fr',
      padding: '0 20px',
    };

    const centerStyle: React.CSSProperties = {
      margin: '0 auto',
      width: '100%',
    };

    const backdropStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 99,
      display: openPanel ? 'block' : 'none',
    };

    const getOverlayStyle = (side: 'left' | 'right', isOpen: boolean): React.CSSProperties => ({
      position: 'fixed',
      top: 0,
      height: '100vh',
      width: '400px',
      backgroundColor: '#1e293b',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 100,
      transition: 'transform 0.3s ease-in-out',
      boxShadow: side === 'left' ? '4px 0 12px rgba(0, 0, 0, 0.5)' : '-4px 0 12px rgba(0, 0, 0, 0.5)',
      ...(side === 'left'
        ? {
            left: 0,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            borderRadius: '0 12px 12px 0',
          }
        : {
            right: 0,
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            borderRadius: '12px 0 0 12px',
          }),
    });

    const toggleButtonsStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '20px',
    };

    const getToggleButtonStyle = (isActive: boolean): React.CSSProperties => ({
      padding: '10px 20px',
      backgroundColor: isActive ? '#8b5cf6' : 'rgba(30, 41, 59, 0.8)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    });

    return (
      <>
        {/* Backdrop */}
        <div style={backdropStyle} onClick={() => setOpenPanel(null)} />

        {/* Left Panel Overlay */}
        <div style={getOverlayStyle('left', openPanel === 'strategy')}>
          {leftPanel}
        </div>

        {/* Right Panel Overlay */}
        <div style={getOverlayStyle('right', openPanel === 'rules')}>
          {rightPanel}
        </div>

        {/* Main Content */}
        <div style={containerStyle}>
          {/* Toggle Buttons */}
          <div style={toggleButtonsStyle}>
            <button
              style={getToggleButtonStyle(openPanel === 'strategy')}
              onClick={() => setOpenPanel(openPanel === 'strategy' ? null : 'strategy')}
            >
              <span>📊</span>
              Strategy
            </button>
            <button
              style={getToggleButtonStyle(openPanel === 'rules')}
              onClick={() => setOpenPanel(openPanel === 'rules' ? null : 'rules')}
            >
              <span>⚙️</span>
              Rules
            </button>
          </div>

          <div style={centerStyle}>{children}</div>
        </div>
      </>
    );
  }

  // Mobile layout (<900px)
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
  };

  const centerStyle: React.CSSProperties = {
    width: '100%',
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 99,
    display: openPanel ? 'block' : 'none',
  };

  const bottomSheetStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    maxHeight: '70vh',
    backgroundColor: '#1e293b',
    borderRadius: '20px 20px 0 0',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 100,
    transition: 'transform 0.3s ease-in-out',
    transform: openPanel ? 'translateY(0)' : 'translateY(100%)',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderBottom: 'none',
  };

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '8px',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };

  const getTabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px',
    backgroundColor: isActive ? '#8b5cf6' : 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  });

  const toggleButtonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0f172a',
    padding: '10px 0',
    zIndex: 10,
  };

  const getToggleButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#8b5cf6' : 'rgba(30, 41, 59, 0.8)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  const [activeTab, setActiveTab] = useState<'strategy' | 'rules'>('strategy');

  return (
    <>
      {/* Backdrop */}
      <div style={backdropStyle} onClick={() => setOpenPanel(null)} />

      {/* Bottom Sheet */}
      <div style={bottomSheetStyle}>
        <div style={tabBarStyle}>
          <button
            style={getTabButtonStyle(activeTab === 'strategy')}
            onClick={() => setActiveTab('strategy')}
          >
            📊 Strategy
          </button>
          <button
            style={getTabButtonStyle(activeTab === 'rules')}
            onClick={() => setActiveTab('rules')}
          >
            ⚙️ Rules
          </button>
        </div>

        {activeTab === 'strategy' ? leftPanel : rightPanel}
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Toggle Button */}
        <div style={toggleButtonsStyle}>
          <button
            style={getToggleButtonStyle(openPanel !== null)}
            onClick={() => setOpenPanel(openPanel ? null : 'strategy')}
          >
            {openPanel ? '✕ Close' : '📊 Strategy & Rules'}
          </button>
        </div>

        <div style={centerStyle}>{children}</div>
      </div>
    </>
  );
}
