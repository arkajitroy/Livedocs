


import { Extension } from "@tiptap/react";
import "@tiptap/extension-text-style"

// Esta extensión personalizada:
// 1º Agrega un atributo fontSize que se aplica como un estilo CSS(style = "font-size: ...") en el HTML del editor.
// 2º Define comandos(setFontSize y unsetFontSize) para agregar o eliminar el tamaño de fuente del texto seleccionado.
// 3º Se integra con textStyle, aprovechando la extensión existente para manejar estilos de texto.



declare module "@tiptap/core" {                                 // Este bloque amplía el sistema de tipado de TipTap.
  interface Commands<ReturnType> {                              // Declaración del tipo Commands. 
    fontSize: {                                                 // Se declara un nuevo comando fontSize con dos métodos:
      setFontSize: (size: string) => ReturnType                 // setFontSize: Establece el tamaño de fuente.
      unsetFontSize: () => ReturnType                           // unsetFontSize: Elimina el tamaño de fuente.
    }
  }
}

export const FontSizeExtension = Extension.create({             // Creación de la extensión FontSizeExtension.
  name: "fontSize",
  addOptions() {                                                // addOptions: Define configuraciones personalizadas para la extensión
    return {
      types: ["textStyle"],                                     // types: Especifica que la extensión trabajará con elementos que usen el marcador (mark) textStyle -> esta extensión es compatible con estilos de texto.
    }
  },
  addGlobalAttributes() {                                       // addGlobalAttributes: Define atributos globales que pueden ser usados por esta extensión.
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,                                      // Valor inicial del atributo (nulo si no se establece un tamaño).
            parseHTML: element => element.style.fontSize,       // Define cómo extraer el tamaño de fuente (fontSize) del HTML cuando se carga contenido en el editor.
            renderHTML: attributes => {                         // Define cómo representar el tamaño de fuente en HTML al generar el contenido del editor.
              if(!attributes.fontSize){
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`      // Si attributes.fontsize está presente, se agrega un estilo CSS como style="font-size: ...". 
              }
            }
          }
        }
      }
    ]
  },
  addCommands() {                                                // Comandos personalizados que se usarán para interactuar con esta extensión.
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {        // setFontSize recibe un tamaño de fuente como argumento.
        return chain()                                           // (chain: Es un patrón de TipTap para encadenar comandos antes de ejecutarlos con .run().)
          .setMark("textStyle", { fontSize })                    // Aplica el estilo textStyle con el tamaño de fuente proporcionado.
          .run()
      },
      unsetFontSize: () => ({ chain }) => {                      // Elimina el tamaño de fuente estableciendo fontSize como null.
        return chain()
          .setMark("textStyle", { fontSize: null })
          .removeEmptyTextStyle()                                // Llama a removeEmptyTextStyle para eliminar el marcador textStyle si ya no tiene atributos.
          .run()
      }
    }
  }
})