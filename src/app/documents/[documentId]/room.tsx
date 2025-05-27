

"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers, getDocuments } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";

type User = {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export function Room({ children }: { children: ReactNode }) {

  const params = useParams();

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(() => async() => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch { 
        toast.error("Failed to fetch users");
      }
  },[]);

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <LiveblocksProvider 
      throttle={16}                                                        // Define la cantidad de actualizaciones por segundo (en este caso, 16 FPS).
      authEndpoint={
        async() => {
          const endpoint = "/api/liveblocks-auth";                         // Utiliza el endpoint /api/liveblocks-auth para verificar los permisos y generar un token de acceso para el usuario.
          const room = params.documentId as string;
          const response = await fetch( endpoint, {
            method: "POST",
            body: JSON.stringify({ room }),
          })
          return await response.json();
        }
      }                                  
      resolveUsers={({userIds}) => {                                        // Se recibe el array de Users de la room y se desestructuran los ids (usersIds)
        return userIds.map(                                                 // Estos se mapean  
          (userId) => users.find((user) => user.id === userId) ?? undefined // y se devuelve un userId que === al user.id de la lista de users
        )
      }}
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if( text ){
          filteredUsers = users.filter((user) =>                            // Se filtran los users por el texto de búsqueda
            user.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
          )
        }
        return filteredUsers.map((user) => user.id)
      }}
      resolveRoomsInfo={async({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id: document.id,
          name: document.name
        }))
      }}
    >
      {/* RoomProvider configura la sala específica basada en params.documentId. */}
      <RoomProvider 
        id={params.documentId as string}
        initialStorage={{
          leftMargin: LEFT_MARGIN_DEFAULT,
          rightMargin: RIGHT_MARGIN_DEFAULT,
        }}  
      >  
        <ClientSideSuspense fallback={<FullscreenLoader label="Room loading" />}>
        {/* Una vez configurada la sala, los hijos (children) tienen acceso a las funcionalidades en tiempo real de Liveblocks. */}
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}