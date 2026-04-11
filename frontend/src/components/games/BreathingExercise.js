import React, { useState, useEffect } from 'react';

export default function BreathingExercise() {
  const [phase, setPhase] = useState('Inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (phase === 'Inhale') { setPhase('Hold'); return 7; }
            if (phase === 'Hold') { setPhase('Exhale'); return 8; }
            if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const getScale = () => {
    if (!isActive) return 1;
    if (phase === 'Inhale') return 1.5;
    if (phase === 'Hold') return 1.5;
    if (phase === 'Exhale') return 1;
  };

  const getDuration = () => {
    if (phase === 'Inhale') return '4s';
    if (phase === 'Hold') return '0s';
    if (phase === 'Exhale') return '8s';
    return '1s';
  };

  return (
    <div style={{
      width: '100%',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      <div 
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-ocean)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `transform ${getDuration()} linear`,
          transform: `scale(${getScale()})`,
          boxShadow: '0 0 40px rgba(225, 235, 240, 0.8)',
          cursor: 'pointer'
        }}
        onClick={() => {
           if(!isActive) { setIsActive(true); setPhase('Inhale'); setTimeLeft(4); }
           else { setIsActive(false); setPhase('Inhale'); }
        }}
      >
        <div style={{
          textAlign: 'center',
          transform: `scale(${1 / getScale()})`, /* Keep text unscaled */
          transition: `transform ${getDuration()} linear`,
          color: 'var(--text-primary)',
          fontWeight: '500'
        }}>
          {!isActive ? 'Start' : (
            <>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{phase}</div>
              <div style={{ fontSize: '2rem' }}>{timeLeft}</div>
            </>
          )}
        </div>
      </div>
      
      <p style={{ position: 'absolute', bottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        4-7-8 Deep Breathing Technique
      </p>
    </div>
  );
}
