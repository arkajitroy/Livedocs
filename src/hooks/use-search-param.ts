
// Nuqs gestiona los parámetros de búsqueda en URLs estableciendo un estado y sincronizando el estado con la URL

import { parseAsString, useQueryState } from "nuqs";

export function useSearchParam() {            // wrapper personalizado para gestionar parámetros de búsqueda en URLs usando la biblioteca nuqs. Toma un key (nombre del parámetro) y un valor por defecto
  return useQueryState(                                                      // Utiliza useQueryState para sincronizar el estado con la URL
    "search",                                                                // Toma un key (nombre del parámetro) y un valor por defecto
    parseAsString                                                            // parseAsString configura el parámetro para  1º manejar valores como strings
      .withDefault("")                                                       //  2º usar un string vacio como default 
      .withOptions({ clearOnDefault: true }),                                // 3º limpiar el parámetro de la URL cuando tiene el valor default
  );
}