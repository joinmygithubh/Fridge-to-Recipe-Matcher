import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import toast from 'react-hot-toast';
import { fridgeApi } from '@services/api';
import { useAuth } from '@context/AuthContext';

const FridgeContext = createContext(null);

export function FridgeProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [fridgeItems, setFridgeItems] = useState([]); // array of { name, addedAt }
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setFridgeItems([]);
      return;
    }
    setLoading(true);
    try {
      const { fridge } = await fridgeApi.get();
      setFridgeItems(fridge.ingredients || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch the fridge whenever auth state changes.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const addIngredient = useCallback(
    async (rawName) => {
      const name = (rawName || '').trim();
      if (!name) return;

      // Case-insensitive guard against duplicates on the client.
      const already = fridgeItems.some(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (already) {
        toast(`${name} is already in your fridge`);
        return;
      }

      // Optimistic update, then sync with the server.
      const optimistic = [...fridgeItems, { name, addedAt: new Date().toISOString() }];
      setFridgeItems(optimistic);
      try {
        const { fridge } = await fridgeApi.add(name);
        setFridgeItems(fridge.ingredients || []);
      } catch (err) {
        setFridgeItems(fridgeItems); // roll back
        toast.error(err.message);
      }
    },
    [fridgeItems]
  );

  const removeIngredient = useCallback(
    async (name) => {
      const previous = fridgeItems;
      setFridgeItems(fridgeItems.filter((i) => i.name !== name));
      try {
        const { fridge } = await fridgeApi.remove(name);
        setFridgeItems(fridge.ingredients || []);
      } catch (err) {
        setFridgeItems(previous); // roll back
        toast.error(err.message);
      }
    },
    [fridgeItems]
  );

  const clearFridge = useCallback(async () => {
    const previous = fridgeItems;
    setFridgeItems([]);
    try {
      const { fridge } = await fridgeApi.clear();
      setFridgeItems(fridge.ingredients || []);
    } catch (err) {
      setFridgeItems(previous);
      toast.error(err.message);
    }
  }, [fridgeItems]);

  const value = {
    fridgeItems,
    loading,
    refresh,
    addIngredient,
    removeIngredient,
    clearFridge,
  };

  return (
    <FridgeContext.Provider value={value}>{children}</FridgeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFridge() {
  const ctx = useContext(FridgeContext);
  if (!ctx) throw new Error('useFridge must be used within a FridgeProvider');
  return ctx;
}
