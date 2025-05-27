import React from 'react'
import { Document } from './document'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'


interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>
}

const documentIdPage = async ({ params }: DocumentIdPageProps) => {  // La precarga del documento se realiza del lado del servidor

  const { documentId } = await params;
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" }) ?? undefined;
  if(!token) {
    throw new Error("Unauthorized");
  }

  const preloadedDocument = await preloadQuery( // Preload del document según id más autenticación de token si es necesario
    api.documents.getById,
    { id: documentId },
    { token }
  )

  return <Document preloadedDocument={preloadedDocument} />   // La precarga se pasa a al <Document /> del lado del cliente
}

export default documentIdPage