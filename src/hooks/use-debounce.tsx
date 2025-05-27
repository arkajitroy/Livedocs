import { useCallback, useRef } from "react";

// Función para aplazar la ejecución de una función
// args representan los parámetros que necesita la función a retrasar callback. El tipo genérico <T> asegura que el hook sea flexible para aceptar cualquier función con parámetros y valores de retorno.
// callback es la función que queremos ejecutar despues del retraso con esos parámetros.

export function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>,>(callback: T, delay: number = 500) { 

  const timeoutRef = useRef<NodeJS.Timeout>();            // Ref para guardar la referencia del temporizador

  return useCallback((...args: Parameters<T>) => {        // callback es la función que queremos ejecutar despues del retraso.
                                                          
    if(timeoutRef.current){
      clearTimeout(timeoutRef.current);                   // Si hay un temporizador en curso (timeoutRef.current), lo limpia con clearTimeout.
    }

    timeoutRef.current = setTimeout(() => {               // Configura un nuevo temporizador con setTimeout que ejecuta el callback después del retraso especificado.
      callback(...args);
    }, delay);

  }, [callback, delay]); // La función aplazada se vuelve a crear solo cuando cambian el retraso o la función a aplazar.
}
