import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AuthState {
  user: { name: string; kycStatus: 'Verified' | 'Pending' | 'Not Started' } | null;
  isAuthenticated: boolean;
  phoneNumber: string | null;
}

type AuthAction = 
  | { type: 'LOGIN'; payload: { phoneNumber: string } }
  | { type: 'VERIFY_OTP'; payload: { user: AuthState['user'] } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  phoneNumber: null,
};

const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<AuthAction> } | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer((state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'LOGIN': return { ...state, phoneNumber: action.payload.phoneNumber };
      case 'VERIFY_OTP': return { ...state, isAuthenticated: true, user: action.payload.user };
      case 'LOGOUT': return initialState;
      default: return state;
    }
  }, initialState);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
