import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  weight: number; // in grams
  price: number;
  thumbnail: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
};

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer((state: CartState, action: CartAction): CartState => {
    switch (action.type) {
      case 'ADD_ITEM': {
        const newItems = [...state.items, action.payload];
        return { items: newItems, total: newItems.reduce((acc, item) => acc + item.price, 0) };
      }
      case 'REMOVE_ITEM': {
        const newItems = state.items.filter(item => item.id !== action.payload);
        return { items: newItems, total: newItems.reduce((acc, item) => acc + item.price, 0) };
      }
      case 'CLEAR_CART': return initialState;
      default: return state;
    }
  }, initialState);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
