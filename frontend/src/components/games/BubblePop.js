import React, { useState, useEffect, useRef } from 'react';

export default function BubblePop() {
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Initial bubbles
    const initial = [];
    for (let i = 0; i < 15; i++) {
      initial.push(createBubble(i));
    }
    setBubbles(initial);

    // Spawner
    const interval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < 25) {
          return [...prev, createBubble(Date.now())];
        }
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const createBubble = (id) => {
    const size = Math.random() * 40 + 30; // 30px to 70px
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 80 + 10;
    const colors = ['#fcebep', '#679a52ff', '#77b5d4ff', '#bb9cf0ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return { id, size, x, y, color, popped: false };
  };

  const popBubble = (id) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== id));
    }, 300); // fade out duration
  };

  return (
    <div style={{
      width: '100%',
      height: '300px',
      position: 'relative',
      background: 'linear-gradient(to bottom right, #fdfbfb, #f2f6f5)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      cursor: 'crosshair'
    }} ref={containerRef}>
      <div style={{ position: 'absolute', top: '1rem', left: '0', right: '0', textAlign: 'center', pointerEvents: 'none', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        Pop naturally. No points, no rush.
      </div>

      {bubbles.map(bubble => (
        <div key={bubble.id}
          onClick={() => popBubble(bubble.id)}
          style={{
            position: 'absolute',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            backgroundColor: bubble.color,
            borderRadius: '50%',
            transform: bubble.popped ? 'scale(1.5)' : 'scale(1)',
            opacity: bubble.popped ? 0 : 0.8,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: 'inset -5px -5px 15px rgba(255,255,255,0.5), inset 5px 5px 15px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        />
      ))}
    </div>
  );
}
