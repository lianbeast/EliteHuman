import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'elitehuman-cart-v1';

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private mode or quota exceeded — cart persists in memory only.
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readCart());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const add = useCallback((product, size) => {
    setItems((prev) => {
      const key = `${product.id}:${size}`;
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { key, product, size, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty <= 0) {
      remove(key);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, [remove]);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.qty,
    0
  );
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        open,
        setOpen,
        add,
        remove,
        updateQty,
        clear,
        subtotal,
        count,
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