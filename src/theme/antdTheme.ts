// src/theme/antdTheme.ts
import { theme as antdTheme, type ThemeConfig } from 'antd';

export const darkThemeConfig: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#2563eb',
    colorBgBase: '#060b18',
    colorBgContainer: '#0d1733',
    colorBgElevated: '#111f44',
    colorBorder: 'rgba(96, 165, 250, 0.16)',
    colorText: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    borderRadius: 8,
  },
  components: {
    Layout: {
      bodyBg: '#060b18',
      headerBg: '#0a1128',
      siderBg: '#0a1128',
    },
    Card: {
      colorBgContainer: '#0d1733',
      colorBorderSecondary: 'rgba(96, 165, 250, 0.16)',
    },
    Menu: {
      itemSelectedBg: 'rgba(37, 99, 235, 0.18)',
      itemSelectedColor: '#38bdf8',
      itemHoverBg: 'rgba(37, 99, 235, 0.08)',
      itemColor: '#94a3b8',
    },
    Button: {
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#3b82f6',
    },
  },
};

export const lightThemeConfig: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#2563eb',
    colorBgBase: '#f0f4f8',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: 'rgba(37, 99, 235, 0.12)',
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
    borderRadius: 8,
  },
  components: {
    Layout: {
      bodyBg: '#f0f4f8',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
    Card: {
      colorBgContainer: '#ffffff',
      colorBorderSecondary: 'rgba(37, 99, 235, 0.12)',
    },
    Menu: {
      itemSelectedBg: 'rgba(37, 99, 235, 0.12)',
      itemSelectedColor: '#2563eb',
      itemHoverBg: 'rgba(37, 99, 235, 0.05)',
      itemColor: '#475569',
    },
    Button: {
      colorPrimary: '#2563eb',
      colorPrimaryHover: '#3b82f6',
    },
  },
};
