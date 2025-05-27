

import { Liveblocks } from "@liveblocks/node"
import { auth, currentUser } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../convex/_generated/api";


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!
})



export async function POST(req:Request) {
  const { sessionClaims } = await auth();                   // Verifica que haya una sesión activa en clerk
  if(!sessionClaims){
    return new Response("Unauthorized", {status: 401})
  }

  const user = await currentUser()                          // Obtenemos el user desde clerk
  if(!user){
    return new Response("Unauthorized", {status: 401})
  }

  const { room } = await req.json()                                        // El roomProvider utiliza params.documentId como el id del room y este se pasa a este endpoint como cuerpo de la solicitud 
  const document = await convex.query(api.documents.getById, { id: room }) // Obtenemos el documento asociado al room
  if(!document){
    return new Response("Unauthorized", {status: 401})
  }

  const isOwner = document.ownerId === user.id                                   // Comprobamos si el usuario logueado es el propietario del documento
  const isOrganizationMember = !!(document.organizationId && document.organizationId === sessionClaims.org_id)  // Se comprueba si el usuario logueado es miembro de la organización

  if (!isOwner && !isOrganizationMember){
    return new Response("Unauthorized", {status: 401})
  }

  const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
  const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = Math.abs(nameToNumber) % 360;
  const color = `hsl(${hue}, 80%, 60%)`

  const session = liveblocks.prepareSession(user.id, {                     // Si se valido el usuario, se crea una sesión de liveblocks
    userInfo: {                                                            // Se agrega información sobre el usuario
      name: name,
      avatar: user.imageUrl,
      color: color
    }
  });

  session.allow(room, session.FULL_ACCESS);                                // Se otorga acceso completo (FULL_ACCESS) al room.
  const { body, status } = await session.authorize();                      // Se autoriza la sesión y se devuelve el body y el status de la respuesta.

  return new Response( body, { status })
}