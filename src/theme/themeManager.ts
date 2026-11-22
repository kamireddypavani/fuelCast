// src/theme/themeManager.ts
import { theme as antdTheme, type ThemeConfig } from 'antd';

export interface ThemeColors {
  primary: string;
  bgPrimary: string;
  panelBg: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
}

export interface AppThemeDefinition {
  id: string;
  name: string;
  category: 'dark' | 'light';
  colors: ThemeColors;
}

export const DEFAULT_THEMES: AppThemeDefinition[] = [
  {
    id: 'dark',
    name: 'FuelCast Midnight Theme',
    category: 'dark',
    colors: {
      primary: '#2563EB',
      bgPrimary: '#060B18',
      panelBg: '#0D1733',
      borderColor: 'rgba(96, 165, 250, 0.16)',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
    },
  },
  {
    id: 'light',
    name: 'FuelCast Clean Light Theme',
    category: 'light',
    colors: {
      primary: '#2563EB',
      bgPrimary: '#F0F4F8',
      panelBg: '#FFFFFF',
      borderColor: 'rgba(37, 99, 235, 0.12)',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
    },
  },
];

export function resolveThemeDefinition(themeId: string): AppThemeDefinition {
  const found = DEFAULT_THEMES.find((t) => t.id === themeId);
  return found || DEFAULT_THEMES[0];
}

export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

export function applyThemeToDocument(theme: AppThemeDefinition): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme.category);
  root.setAttribute('data-theme-id', theme.id);
  const { colors } = theme;
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--bg-primary', colors.bgPrimary);
  root.style.setProperty('--panel-bg', colors.panelBg);
  root.style.setProperty('--border-color', colors.borderColor);
  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-secondary', colors.textSecondary);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-theme-changed', { detail: { themeId: theme.id } }));
  }
}

export function createAntdThemeConfig(theme: AppThemeDefinition): ThemeConfig {
  const isDark = theme.category === 'dark';
  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: theme.colors.primary,
      colorBgBase: theme.colors.bgPrimary,
      colorBgContainer: theme.colors.panelBg,
      colorBorder: theme.colors.borderColor,
      colorText: theme.colors.textPrimary,
      colorTextSecondary: theme.colors.textSecondary,
      borderRadius: 8,
    },
    components: {
      Layout: {
        bodyBg: isDark ? '#060B18' : '#F0F4F8',
        headerBg: isDark ? '#0A1128' : '#FFFFFF',
        siderBg: isDark ? '#0A1128' : '#FFFFFF',
      },
      Card: {
        colorBgContainer: theme.colors.panelBg,
        colorBorderSecondary: theme.colors.borderColor,
      },
      Menu: {
        itemSelectedBg: isDark ? 'rgba(37, 99, 235, 0.18)' : 'rgba(37, 99, 235, 0.12)',
        itemSelectedColor: isDark ? '#38BDF8' : '#2563EB',
        itemHoverBg: isDark ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.05)',
      },
    },
  };
}
