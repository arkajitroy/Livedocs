

"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids }) // Obtenemos los documentos asociados a los ids

}

export async function getUsers() {
  const { sessionClaims } = await auth()

  const clerk = await clerkClient()
 
  const response = await clerk.users.getUserList({       // Obtenemos la lista de usuarios de la organización
    organizationId: [sessionClaims?.org_id as string],
  });


  const users = response.data.map((user) => ({           // Convierte la lista de usuarios en una lista de objetos con el id y el nombre del usuario
    id: user.id,
    name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
    avatar: user.imageUrl,
    color: "",
  }));

  return users;
}