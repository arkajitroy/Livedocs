import { useRef, useState } from "react"
import { useStorage, useMutation } from "@liveblocks/react"
import { FaCaretDown } from "react-icons/fa"
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins"

const markers = Array.from({ length: 83 }, (_, i) => i)

export const Ruler = () => {

  const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT  // Usa storage para acceder a los margenes de la regla
  const setLeftMargin = useMutation(({ storage }, position: number) => {           // Usa mutation para actualizar los margenes de la regla
    storage.set("leftMargin", position)
  },[]);

  const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT
  const setRightMargin = useMutation(({ storage }, position: number) => {
    storage.set("rightMargin", position)
  },[]);
 

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true); 
  }

  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  }

  const handleMouseMove = (e: React.MouseEvent) => {                         // Calcula la nueva posición del marcador en función de la posición del ratón.
    if((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      const container = rulerRef.current.querySelector("#ruler-container");  // Obtiene el contenedor de la regla
      if(container) {
        const containerRect = container.getBoundingClientRect();             // Obtiene el rectángulo del contenedor (containerRect).
        const relativeX = e.clientX - containerRect.left;                    // Calcula la posición del cursor del ratón con respecto a los límites del contenedor (relativeX).
        const rawPosition = Math.max(0, Math.min(816, relativeX))            // Limita el valor de relativeX para que no sobrepase los límites de la regla
      
        if (isDraggingLeft) {                                                // Si el marcador está siendo arrastrado a la izquierda 
          const maxLeftPosition = 816 - rightMargin - 100;                   // calcula la posición máxima que puede tener el marcador izquierdo,
          const newLeftPosition = Math.min(rawPosition, maxLeftPosition)     // y establece la nueva posición del marcador izquierdo como el mínimo entre el valor actual y la posición máxima.
          setLeftMargin(newLeftPosition);                                    // Actualiza el estado del marcador izquierdo.
        }else if(isDraggingRight){
          const maxRightPosition = 816 - leftMargin + 100;
          const newRightPosition = Math.max(816 - rawPosition, 0)
          const constrainedRightPosition = Math.min(newRightPosition, maxRightPosition)
          setRightMargin(constrainedRightPosition);
        }          
      }
    }
  }

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  }

  const handleLeftDoubleClick = () => {
    setLeftMargin(LEFT_MARGIN_DEFAULT);
  }

  const handleRightDoubleClick = () => {
    setRightMargin(RIGHT_MARGIN_DEFAULT);
  }


  return(
    <div 
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-[816px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
    >
      <div
        id="ruler-container"
        className="w-full h-full relative"
      >
        <Marker 
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]"> 
            {markers.map((marker) => {
              const position = (marker * 816) / 82; // divide by 82 to get the position in pixels
              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px`}}
                >
                  {marker % 10 === 0 && ( // show a marker every 10 pixels
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}  
                      </span>
                    </>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && ( // show a marker every 5 pixels and every 10 pixels with h-[1.5px]
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}
                  {marker % 5 !== 0 && ( // show a marker every 5 pixels with h-[1px]
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({ position, isLeft, isDragging, onMouseDown, onDoubleClick }: MarkerProps) => {
  return (
    <div className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
      <div 
        className="absolute left-1/2 top-4 transform -translate-x-1/2 duration-150"
        style={{
          height: "100vh",
          width: "1px",
          transform: "scaleX(0.5)",
          backgroundColor: "#3b72f6",
          display: isDragging ? "block" : "none",

        }}
      />
    </div>
  )
}