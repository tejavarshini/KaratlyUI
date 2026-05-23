import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp, validateToken as apiValidateToken, getAuthToken, isAuthenticated, clearAuthSession as apiClearSession } from '../api/authApi';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: { name: string; kycStatus: 'Verified' | 'Pending' | 'Not Started' } | null;
  isAuthenticated: boolean;
  phoneNumber: string | null;
  email: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  authType: 'login' | 'register';
  token: string | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { phoneNumber: string; email: string; fullName: string; dateOfBirth?: string; authType: 'login' | 'register' } }
  | { type: 'VERIFY_OTP'; payload: { user: AuthState['user']; token: string; fullName?: string; email?: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_SESSION'; payload: { user: AuthState['user']; token: string; fullName?: string; email?: string } };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  phoneNumber: null,
  email: null,
  fullName: null,
  dateOfBirth: null,
  authType: 'login',
  token: null,
  loading: true,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  sendOtp: (params: { mobileNumber: string; email: string; fullName?: string; dateOfBirth?: string; type?: 'login' | 'register' }) => Promise<{ ok: boolean; message?: string }>;
  verifyOtp: (params: { mobileNumber: string; otp: string; email: string; fullName?: string; dateOfBirth?: string; type?: 'login' | 'register' }) => Promise<{ ok: boolean; token?: string; code?: string; message?: string; userInfo?: Record<string, unknown> }>;
  logout: () => void;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [state, dispatch] = useReducer((state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case 'LOGIN':
        return { ...state, phoneNumber: action.payload.phoneNumber, email: action.payload.email, fullName: action.payload.fullName, dateOfBirth: action.payload.dateOfBirth || null, authType: action.payload.authType };
      case 'VERIFY_OTP':
        return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token, loading: false, fullName: action.payload.fullName || state.fullName, email: action.payload.email || state.email };
      case 'LOGOUT':
        return { ...initialState, loading: false };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'RESTORE_SESSION':
        return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token, loading: false, fullName: action.payload.fullName || state.fullName, email: action.payload.email || state.email };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    if (isAuthenticated() && getAuthToken()) {
      apiValidateToken().then((res: any) => {
        if (res?.ok) {
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user: { name: res?.userInfo?.fullName || 'User', kycStatus: 'Verified' as const }, token: getAuthToken() || '', fullName: res?.userInfo?.fullName || '', email: res?.userInfo?.email || '' }
          });
        } else {
          apiClearSession();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }).catch(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const sendOtp = useCallback(async ({ mobileNumber, email, fullName, dateOfBirth, type = 'login' }: { mobileNumber: string; email: string; fullName?: string; dateOfBirth?: string; type?: 'login' | 'register' }) => {
    dispatch({ type: 'LOGIN', payload: { phoneNumber: mobileNumber, email, fullName: fullName || '', dateOfBirth, authType: type } });
    const response = await apiSendOtp({ mobileNumber, email, fullName, type });
    if (!response?.ok) {
      toast({ variant: 'destructive', title: 'Error', description: response?.message || 'Failed to send OTP' });
    } else {
      toast({ title: 'OTP Sent', description: response?.message || 'OTP sent successfully' });
    }
    return response;
  }, [toast]);

  const verifyOtp = useCallback(async ({ mobileNumber, otp, email, fullName, dateOfBirth, type = 'login' }: {
    mobileNumber: string; otp: string; email: string; fullName?: string; dateOfBirth?: string; type?: 'login' | 'register'
  }) => {
    const response = await apiVerifyOtp({ mobileNumber, otp, email, fullName, dateOfBirth, type });
    if (response?.ok) {
      dispatch({
        type: 'VERIFY_OTP',
        payload: { user: { name: response?.userInfo?.fullName || 'User', kycStatus: 'Verified' as const }, token: response.token || '', fullName: response?.userInfo?.fullName || '', email: response?.userInfo?.email || '' }
      });
      toast({ title: 'Success', description: 'Logged in successfully' });
    } else if (response?.code === 'SESSION_EXISTS') {
      toast({ variant: 'destructive', title: 'Session Error', description: response.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: response?.message || 'OTP verification failed' });
    }
    return response;
  }, [toast]);

  const logout = useCallback(() => {
    apiClearSession();
    dispatch({ type: 'LOGOUT' });
    toast({ title: 'Logged out', description: 'You have been logged out successfully' });
  }, [toast]);

  return (
    <AuthContext.Provider value={{ state, dispatch, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
