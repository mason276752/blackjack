import { useTranslation } from 'react-i18next';
import { useAIPlayer } from '../../hooks/useAIPlayer';

export function AIControlPanel() {
  const { t } = useTranslation('ai');
  const { aiState, startAI, pauseAI, resumeAI, stopAI, setSpeed, resetStatistics } = useAIPlayer();

  // 10 discrete speed levels (left = slowest, right = fastest)
  const speedLevels = [5000, 3000, 2000, 1500, 1000, 500, 250, 100, 50, 10];

  // Convert slider position (0-9) to speed
  const positionToSpeed = (position: number): number => {
    return speedLevels[position];
  };

  // Convert speed to slider position (0-9)
  const speedToPosition = (speed: number): number => {
    // Find closest speed level
    let closestIndex = 0;
    let minDiff = Math.abs(speed - speedLevels[0]);

    for (let i = 1; i < speedLevels.length; i++) {
      const diff = Math.abs(speed - speedLevels[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    return closestIndex;
  };

  const handleTogglePlay = () => {
    if (!aiState.isEnabled) {
      startAI();
    } else if (aiState.isPlaying) {
      pauseAI();
    } else {
      resumeAI();
    }
  };

  const handleStop = () => {
    stopAI();
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        margin: '40px auto 20px',
        maxWidth: '800px',
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: '#8b5cf6', fontSize: '18px' }}>
          🤖 {t('aiPlayer')}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleTogglePlay}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: aiState.isPlaying ? '#f59e0b' : '#22c55e',
              color: 'white',
              transition: 'background-color 0.2s',
            }}
          >
            {aiState.isPlaying ? '⏸ ' + t('pause') : '▶ ' + t('play')}
          </button>
          {aiState.isEnabled && (
            <button
              onClick={handleStop}
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#ef4444',
                color: 'white',
                transition: 'background-color 0.2s',
              }}
            >
              ⏹ {t('stop')}
            </button>
          )}
        </div>
      </div>

      {/* Speed Control Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
          <span style={{ color: '#94a3b8' }}>{t('gameSpeed')}:</span>
          <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
            {aiState.speed < 50 ? t('veryFast') : aiState.speed > 2000 ? t('slow') : aiState.speed > 500 ? t('fast') : t('veryFast')} ({aiState.speed}ms)
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="9"
          step="1"
          value={speedToPosition(aiState.speed)}
          onChange={(e) => setSpeed(positionToSpeed(Number(e.target.value)))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            outline: 'none',
            cursor: 'pointer',
            accentColor: '#8b5cf6',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          <span>{t('slow')} (5000ms)</span>
          <span>{t('fast')} (10ms)</span>
        </div>
      </div>

      {/* Error Display */}
      {aiState.stuckDetected && aiState.errorMessage && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold', marginBottom: '6px' }}>
            ⚠️ {t('errorDetected')}
          </div>
          <div style={{ fontSize: '14px', color: 'white', lineHeight: '1.5', marginBottom: '8px' }}>
            {aiState.errorMessage}
          </div>
          <button
            onClick={() => {
              stopAI();
              setTimeout(() => startAI(), 100);
            }}
            style={{
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 'bold',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#3b82f6',
              color: 'white',
            }}
          >
            🔄 {t('retry')}
          </button>
        </div>
      )}

      {/* Current Decision Display - Always reserve space */}
      {aiState.isEnabled && (
        <div
          style={{
            backgroundColor: aiState.currentDecision ? 'rgba(139, 92, 246, 0.1)' : 'rgba(55, 65, 81, 0.05)',
            border: `1px solid ${aiState.currentDecision ? 'rgba(139, 92, 246, 0.3)' : 'rgba(55, 65, 81, 0.2)'}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            minHeight: '80px',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{
            fontSize: '12px',
            color: aiState.currentDecision ? '#8b5cf6' : '#64748b',
            fontWeight: 'bold',
            marginBottom: '6px'
          }}>
            💡 {t('currentDecision')}
          </div>
          {aiState.currentDecision ? (
            <div style={{ fontSize: '14px', color: 'white', lineHeight: '1.5' }}>
              <strong style={{ color: '#fbbf24' }}>
                {aiState.currentDecision.action.toUpperCase()}
              </strong>
              <br />
              {aiState.currentDecision.reasoning}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', lineHeight: '1.5' }}>
              {t('waitingForDecision')}
            </div>
          )}
        </div>
      )}

      {/* AI Statistics */}
      {aiState.isEnabled && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              fontSize: '13px',
              marginBottom: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', marginBottom: '4px' }}>{t('roundsPlayed')}</div>
              <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '18px' }}>
                {aiState.statistics.roundsPlayed}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', marginBottom: '4px' }}>{t('decisionsCount')}</div>
              <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '18px' }}>
                {aiState.statistics.decisionsCount}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#94a3b8', marginBottom: '4px' }}>{t('avgBetSize')}</div>
              <div style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '18px' }}>
                ${aiState.statistics.avgBetSize > 0 ? aiState.statistics.avgBetSize.toFixed(0) : '0'}
              </div>
            </div>
          </div>

          {/* Reset Statistics Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={resetStatistics}
              style={{
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 'bold',
                borderRadius: '6px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                cursor: 'pointer',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                color: '#94a3b8',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.2)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              🔄 {t('resetStats')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
