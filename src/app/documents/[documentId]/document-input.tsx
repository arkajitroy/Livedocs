import { BsCloudCheck, BsCloudSlash } from "react-icons/bs"
import { Id } from "../../../../convex/_generated/dataModel";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { useStatus } from "@liveblocks/react";
import { LoaderIcon } from "lucide-react";

interface DocumentInputProps {
  title: string;
  id: Id<"documents">
}

export const DocumentInput = ({title, id}: DocumentInputProps) => {

  const status = useStatus()

  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutate = useMutation(api.documents.updateById);

  const debouncedUpdate = useDebounce((newValue: string) => {         // El código que existe en el debounceUpdate se ejecuta después del retraso. Se vita así una actualización con cada pulsación del teclado.
    if (newValue === title) return;                                   
    setIsPending(true);                                               
    mutate({ id, title: newValue })
      .then(() => {
        toast.success("Document updated")
        setIsEditing(false);
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {      // Se activa cada vez que el usuario escribe una letra.  
    const newValue = e.target.value;                                  // Solo envía una solicitud al servidor cuando el usuario deja de escribir por más de 500ms.
    setValue(newValue);
    debouncedUpdate(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {     // Se activa cuando el usuario presiona "Enter" o envía el formulario.
    e.preventDefault();                                               // Actualiza el documento en el servidor inmediatamente, sin retrasos, utilizando el valor actual del estado value.
    setIsPending(true);                                               // Es útil cuando el usuario desea guardar el cambio manualmente (es decir, confirmarlo explícitamente) en lugar de depender del retraso de debouncedUpdate.
    mutate({ id, title: value })
      .then(() => toast.success("Document updated"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  }

  const showLoader = isPending || status === "connecting" || status === "reconnecting";
  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form 
          onSubmit={handleSubmit}
          className="relative w-fit max-w-[50ch]"
        >
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value ||" "}
          </span>
          <input 
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)} 
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span 
          className="text-lg px-1.5 cursor-pointer truncate"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0)
          }}
        >
          {title}
        </span>
      )}
      {showError && <BsCloudSlash className="size-4"/>}
      {!showError && !showLoader && <BsCloudCheck />}
      {showLoader && <LoaderIcon className="size-4 animate-spin text-muted-foreground" />}
    </div>
  )
}