"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TRACKS = [
  { id: 'rain', name: 'Gentle Rain', url: '/audio/calm rain.mp3' },
  { id: 'nature', name: 'Nature', url: '/audio/nature(birds).mp3' },
  { id: 'ocean', name: 'Ocean', url: '/audio/ocean waves.mp3' },
  { id: 'river', name: 'River', url: '/audio/river flowing.mp3' }
];

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef(null);
  
  // We no longer need location-based collapsing since it's strictly pinned to the Sidebar.

  useEffect(() => {
    audioRef.current = new Audio(TRACKS[0].url);
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!audio.src.includes(TRACKS[currentTrackIndex].url)) {
        audio.src = TRACKS[currentTrackIndex].url;
        if (isPlaying) {
          audio.play().catch(e => console.error("Audio playback prevented:", e));
        }
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        console.error("Audio playback prevented:", e);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="ambient-global-player">
      <div className="player-content" style={{ width: '100%' }}>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600', fontFamily: '"Playfair Display", serif' }}>
          Ambient Therapy
        </h4>

        <select
          value={currentTrackIndex}
          onChange={(e) => setCurrentTrackIndex(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          {TRACKS.map((track, idx) => (
            <option key={track.id} value={idx}>{track.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={togglePlay}
            style={{
              background: isPlaying ? 'var(--accent-lavender)' : 'var(--accent-sage)',
              color: isPlaying ? 'var(--text-primary)' : '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent-sage)' }}
          />
        </div>
      </div>
    </div>
  );
}
