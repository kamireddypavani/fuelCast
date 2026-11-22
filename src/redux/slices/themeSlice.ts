// src/redux/slices/themeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { resolveThemeDefinition, applyThemeToDocument, getSystemTheme } from '@/theme/themeManager';

export interface ThemeState {
  mode: 'dark' | 'light';
  activeThemeId: string;
}

const getInitialTheme = (): ThemeState => {
  let initialId = getSystemTheme();
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('app-theme-id');
    if (saved) initialId = saved as 'dark' | 'light';
  }
  const def = resolveThemeDefinition(initialId);
  if (typeof document !== 'undefined') {
    applyThemeToDocument(def);
  }
  return { mode: def.category, activeThemeId: initialId };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      const nextId = state.activeThemeId === 'dark' ? 'light' : 'dark';
      state.activeThemeId = nextId;
      const def = resolveThemeDefinition(nextId);
      state.mode = def.category;
      applyThemeToDocument(def);
      localStorage.setItem('app-theme-id', nextId);
    },
    setActiveThemeId(state, action: PayloadAction<string>) {
      state.activeThemeId = action.payload;
      const def = resolveThemeDefinition(action.payload);
      state.mode = def.category;
      applyThemeToDocument(def);
      localStorage.setItem('app-theme-id', action.payload);
    },
  },
});

export const { toggleTheme, setActiveThemeId } = themeSlice.actions;
export default themeSlice.reducer;
