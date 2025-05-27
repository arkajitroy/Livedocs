import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";


export const create = mutation({
  args:{
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if(!user){
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const documentId = await ctx.db.insert("documents", {
      title: args.title ?? "",
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent,
    });

    return documentId;
  }
})


export const get = query({
  args: { paginationOpts: paginationOptsValidator, search: v.optional(v.string()) }, // Se reciben los parametros de paginación y búsqueda
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if(!user){
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    if(search && organizationId){                                         // Si tenemos un término de búsqueda y una organización
      return await ctx.db
        .query("documents")                                               // Buscamos los documentos
        .withSearchIndex("search_title", (q) =>                           // usando el index de búsqueda por title
          q.search("title", search).eq("organizationId", organizationId)  // y buscamos un title donde la organizaciónId = organización logueada
        )
        .paginate(paginationOpts); 
    }

    if(search){                                                           // Si solo tenemos un término de búsqueda
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", (q) =>                           // Usamos el index de búsqueda por title
          q.search("title", search).eq("ownerId", user.subject)           // y buscamos un title donde el ownerId = usuario logueado
        )
        .paginate(paginationOpts);                                        // Al final se paginan los resultados 
    }

    if(organizationId){                                                   // Si solo tenemos una organización
      return await ctx.db
        .query("documents")                                               // Buscamos los documentos
        .withIndex("by_organization_id", (q) =>                           // usando el index de búsqueda por organización
          q.eq("organizationId", organizationId)                          // que pertenecen a la organización logueada
        )
        .paginate(paginationOpts);
    }

    return await ctx.db                                                   // Busqueda sin filtros para los documentos de tu personal account
      .query("documents")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))     // Buscamos los documentos donde el ownerId = usuario logueado
      .paginate(paginationOpts);
    
  },
});


export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if(!user){
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const document = await ctx.db.get(args.id);
    if(!document){
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === organizationId)
    if(!isOwner && !isOrganizationMember){
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete(args.id);
  }
})

export const updateById = mutation({
  args: { 
    id: v.id("documents"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");                            
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    const isOwner = document.ownerId === user.subject;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === organizationId)
    if (!isOwner && !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, { title: args.title });
  }
})

export const getById = query({
  args: {id: v.id("documents")},
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id)
    if(!document){
      throw new ConvexError("Document not found");
    }
    return document    
  }
})

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },    // Se reciben los ids de los documentos que se desea obtener
  handler: async (ctx, { ids }) => {
    const documents = []
    for(const id of ids){                       // Se iteran los ids y se obtienen los documentos asociados
      const document = await ctx.db.get(id);
      if(document){
        documents.push({
          id: document._id,
          name: document.title,
        })} else {
          documents.push({
            id,
            name: "[Removed]"
          })
        }
    }
    return documents
  }
})

