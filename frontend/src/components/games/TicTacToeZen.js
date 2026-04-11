import React, { useState } from 'react';

export default function TicTacToeZen() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // 'O' or 'X'
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const botMove = (currentBoard) => {
    if (winner) return;

    // Super simple random bot (Zen bot) - no stress
    const emptyIndices = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newBoard = [...currentBoard];
      newBoard[randomIdx] = 'AI';
      setBoard(newBoard);
      const isWin = checkWinner(newBoard);
      if (isWin) setWinner(isWin);
      setIsPlayerTurn(true);
    }
  };

  const handleCLick = (idx) => {
    if (!isPlayerTurn || board[idx] || winner) return;

    const newBoard = [...board];
    newBoard[idx] = 'Me';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const isWin = checkWinner(newBoard);
    if (isWin) {
      setWinner(isWin);
    } else {
      setTimeout(() => botMove(newBoard), 600);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
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
    }}>
      {!winner ? (
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          {isPlayerTurn ? "Your turn gently" : "Serene is thinking..."}
        </div>
      ) : (
        <div style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
          {winner === 'Draw' ? "A peaceful balance." : winner === 'Me' ? "You found harmony!" : "Serene found harmony."}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        width: '180px',
        height: '180px'
      }}>
        {board.map((cell, idx) => (
          <div 
            key={idx}
            onClick={() => handleCLick(idx)}
            style={{
              background: cell === 'Me' ? 'var(--accent-sage)' : cell === 'AI' ? 'var(--accent-ocean)' : 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'var(--text-primary)',
              cursor: (!cell && isPlayerTurn && !winner) ? 'pointer' : 'default',
              transition: 'background 0.3s ease',
              boxShadow: 'var(--shadow-soft)'
            }}
          >
            {cell === 'Me' && "⚬"}
            {cell === 'AI' && "⨯"}
          </div>
        ))}
      </div>

      {winner && (
        <button onClick={resetGame} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', textDecoration: 'underline' }}>
          Reset Board
        </button>
      )}
    </div>
  );
}
