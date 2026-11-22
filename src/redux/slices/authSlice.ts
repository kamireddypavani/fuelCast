// src/redux/slices/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'ADMIN' | 'DISTRIBUTOR' | 'DEALER';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  title: string;
  role: UserRole;
  tenantName?: string;
  stationName?: string;
  pumpId?: string;
}

export const PRESET_USERS: Record<UserRole, UserSession> = {
  ADMIN: {
    id: 'usr-admin-1',
    name: 'Aditya Reddy',
    email: 'aditya.reddy@fuelcast.in',
    title: 'Platform Super Admin',
    role: 'ADMIN',
    tenantName: 'FuelCast SaaS Global',
  },
  DISTRIBUTOR: {
    id: 'usr-dist-1',
    name: 'Anil Varma',
    email: 'anil.varma@krishnafuels.in',
    title: 'Operations Director',
    role: 'DISTRIBUTOR',
    tenantName: 'Krishna Petroleum Logistics',
  },
  DEALER: {
    id: 'usr-dealer-1',
    name: 'Ramesh Sharma',
    email: 'dealer@sharmafuels.in',
    title: 'Pump Station Owner',
    role: 'DEALER',
    tenantName: 'Sharma Fuels',
    stationName: 'Sharma Fuels (Benz Circle)',
    pumpId: 'pump-1',
  },
};

interface AuthState {
  isAuthenticated: boolean;
  user: UserSession;
}

const getStoredRole = (): UserRole => {
  try {
    const r = localStorage.getItem('fc_role') as UserRole;
    if (r && PRESET_USERS[r]) return r;
  } catch {
    // ignore
  }
  return 'DISTRIBUTOR';
};

const initialRole = getStoredRole();

const initialState: AuthState = {
  isAuthenticated: true,
  user: PRESET_USERS[initialRole],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<UserRole>) => {
      const role = action.payload;
      state.user = PRESET_USERS[role];
      state.isAuthenticated = true;
      try {
        localStorage.setItem('fc_role', role);
      } catch {
        // ignore
      }
    },
    loginAsUser: (state, action: PayloadAction<UserSession>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('fc_role', action.payload.role);
      } catch {
        // ignore
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('fc_role');
      } catch {
        // ignore
      }
    },
  },
});

export const { switchRole, loginAsUser, logout } = authSlice.actions;
export default authSlice.reducer;
