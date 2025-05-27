import { Extension } from "@tiptap/react";


declare module "@tiptap/core" {                                                  // Este bloque amplía el sistema de tipado de TipTap.
  interface Commands<ReturnType> {                                               // Declaración del tipo Commands.
    lineHeight: {                                                                // Se declara un nuevo comando lineheight con dos métodos:
      setLineHeight: (lineHeight: string) => ReturnType                          // setLineHeight: Establece el tamaño del interlineado.
      unsetLineHeight: () => ReturnType                                          // unsetLineHeight: Elimina el tamaño del interlineado.
    }
  }
}


export const LineHeightExtension = Extension.create({
  name: "lineHeight",
  addOptions() {                                                                  // addOptions: Define configuraciones personalizadas para la extensión
    return {
      types: ["paragraph", "heading"],                                            // types: Define los tipos de nodos que admitirán el atributo de interlineado (en este caso, párrafos y encabezados).
      defaultLineHeight: "normal",                                                // defaultLineHeight: Define un interlineado predeterminado, que es "normal".
    }
  },
  addGlobalAttributes() {                                                         // addGlobalAttributes: Define atributos globales que pueden ser usados por esta extensión.
    return [                                                                      // Devuelve un array de objetos que define los atributos globales.
      {
        types: this.options.types,                                                // types: Especifica los tipos de nodos a los que se aplica este atributo
        attributes: {                                                             // Configuración del atributo lineHeight. Tiene 3 propiedades:
          lineHeight:{
            default: this.options.defaultLineHeight,                              // 1º default: Valor predeterminado del atributo (normal)
            renderHTML: attributes => {                                           // 2º render :Se encarga de generar el HTML correspondiente para el atributo lineHeight. 
              if(!attributes.lineHeight) return {}
              return {
                style: `line-height: ${attributes.lineHeight}`                    // Si attributes.lineHeight está presente, se agrega un estilo CSS como style="line-height: ...".
              }
            },
            parseHTML: element => {                                               // 3º parser: Analiza el HTML y extrae el valor del atributo lineHeight desde los estilos en línea del elemento. 
              return element.style.lineHeight || this.options.defaultLineHeight   // Si el estilo lineHeight está presente, se devuelve el valor. Si no, se devuelve el valor predeterminado.
            },
          }
        }
      }
    ]
  },
  addCommands() {                                                                 // addCommands: Permite registrar nuevos comandos que los usuarios pueden invocar desde el editor.
    return {
      // state: documento, 
      // tr:transacción para realizar cambios, 
      // dispatch si es true se realiza el cambio
      setLineHeight: (lineHeight: string) => ({ tr, state, dispatch }) => {       // Establece un valor de interlineado en los nodos seleccionados.
        const { selection } = state;                                              // Del documento extraemos el texto seleccionado.
        tr = tr.setSelection(selection);                                          // Establece la transacción sobre la que realizar los cambios.

        const { from, to} = selection;                                            // Extraemos el rango de posiciones de los nodos seleccionados.
        state.doc.nodesBetween(from, to, (node, pos) => {                         // Recorremos los nodos entre el rango de posiciones.
          if(this.options.types.includes(node.type.name)){                        // Si el tipo de nodo es un párrafo o un encabezado...
            tr = tr.setNodeMarkup(pos, undefined, {                               // Establecemos el atributo lineHeight con el valor proporcionado.
              ...node.attrs,
              lineHeight
            })
          }
        })

        if (dispatch) dispatch(tr)
        return true
      },// state: documento, 
        // tr:transacción para realizar cambios, 
        // dispatch si es true se realiza el cambio
      unsetLineHeight: () => ({ tr, state, dispatch }) => {                        // Restablece el interlineado de los nodos seleccionados al valor predeterminado.
        const { selection } = state;                                               // Del documento extraemos el texto seleccionado.
        tr = tr.setSelection(selection);                                           // Establece la transacción sobre la que realizar los cambios.

        const { from, to } = selection;                                            // Extraemos el rango de posiciones de los nodos seleccionados.
        state.doc.nodesBetween(from, to, (node, pos) => {                          // Recorremos los nodos entre el rango de posiciones.
          if(this.options.types.includes(node.type.name)){                         // Si el tipo de nodo es un párrafo o un encabezado...
            tr = tr.setNodeMarkup(pos, undefined, {                                // Restablecemos el atributo lineHeight con el valor predeterminado.
              ...node.attrs,
              lineHeight: this.options.defaultLineHeight
            })
          }
        })

        if(dispatch) dispatch(tr)                                                      
        return true
      }
    }
  }
})