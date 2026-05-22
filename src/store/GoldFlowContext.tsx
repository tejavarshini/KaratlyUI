import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface GoldFlowState {
  buyState: { type?: string; amount?: number; brand?: string; address?: string; paymentMethod?: string; };
  sellState: { portfolioItemId?: string; amount?: number; bankAccount?: string; };
  sipState: { amount?: number; frequency?: string; date?: number; type?: string; brand?: string; };
}

type GoldFlowAction = 
  | { type: 'SET_BUY_STATE'; payload: Partial<GoldFlowState['buyState']> }
  | { type: 'SET_SELL_STATE'; payload: Partial<GoldFlowState['sellState']> }
  | { type: 'SET_SIP_STATE'; payload: Partial<GoldFlowState['sipState']> }
  | { type: 'CLEAR_ALL' };

const initialState: GoldFlowState = {
  buyState: {},
  sellState: {},
  sipState: {},
};

const GoldFlowContext = createContext<{ state: GoldFlowState; dispatch: React.Dispatch<GoldFlowAction> } | undefined>(undefined);

export function GoldFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer((state: GoldFlowState, action: GoldFlowAction): GoldFlowState => {
    switch (action.type) {
      case 'SET_BUY_STATE': return { ...state, buyState: { ...state.buyState, ...action.payload } };
      case 'SET_SELL_STATE': return { ...state, sellState: { ...state.sellState, ...action.payload } };
      case 'SET_SIP_STATE': return { ...state, sipState: { ...state.sipState, ...action.payload } };
      case 'CLEAR_ALL': return initialState;
      default: return state;
    }
  }, initialState);

  return <GoldFlowContext.Provider value={{ state, dispatch }}>{children}</GoldFlowContext.Provider>;
}

export const useGoldFlow = () => {
  const context = useContext(GoldFlowContext);
  if (!context) throw new Error('useGoldFlow must be used within GoldFlowProvider');
  return context;
};
