// src/components/ThemeToggle.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleTheme } from '../redux/slices/themeSlice';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((s) => s.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      type="button"
      className={className}
      title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        padding: 4,
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {themeMode === 'dark' ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} style={{ color: '#f59e0b' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
