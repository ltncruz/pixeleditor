import { useEffect, useState } from 'react';

/**
 * Estado sincronizado com o localStorage. Falhas de leitura/escrita (modo
 * privado, quota excedida, etc.) são ignoradas silenciosamente, mantendo o
 * app funcional mesmo sem persistência.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Armazenamento indisponível ou cheio: a edição continua funcionando em memória.
    }
  }, [key, value]);

  return [value, setValue];
}
