'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER'; payload?: boolean }
  | { type: 'CLEAR_LAST_ADDED' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.product.id && i.size === action.payload.size
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.product.id === action.payload.product.id && i.size === action.payload.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        items = [...state.items, { product: action.payload.product, size: action.payload.size, quantity: 1 }];
      }
      return { ...state, items, isDrawerOpen: true, lastAddedItem: action.payload.product.id };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.product.id === action.payload.productId && i.size === action.payload.size)
        ),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.product.id === action.payload.productId && i.size === action.payload.size)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.productId && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: action.payload ?? !state.isDrawerOpen };
    case 'CLEAR_LAST_ADDED':
      return { ...state, lastAddedItem: null };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: string | null;
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (force?: boolean) => void;
  clearLastAdded: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isDrawerOpen: false,
    lastAddedItem: null,
  });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isDrawerOpen: state.isDrawerOpen,
        lastAddedItem: state.lastAddedItem,
        addItem: (product, size) => dispatch({ type: 'ADD_ITEM', payload: { product, size } }),
        removeItem: (productId, size) => dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } }),
        updateQuantity: (productId, size, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, quantity } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleDrawer: (force) => dispatch({ type: 'TOGGLE_DRAWER', payload: force }),
        clearLastAdded: () => dispatch({ type: 'CLEAR_LAST_ADDED' }),
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
