// Import the generated Prisma client

import { NextRequest, NextResponse } from "next/server"
import { initPinecone } from "@/utils/pinecone-client"
import Replicate from "replicate"

import { createPrisma } from "@/lib/prisma"
import { supabaseClient } from "@/lib/supabase"

export async function GET(req: NextRequest, { params: { id } }) {
  const credentials = JSON.parse(req.cookies.get("credentials")?.value || null)

  if (!credentials) {
    return NextResponse.redirect("/credentials")
  }

  const replicate = new Replicate({
    auth: credentials?.replicateApiKey,
  })

  const prediction = await replicate.predictions.get(id)

  return NextResponse.json({ data: prediction })
}

// delete document and pinecone namespace for document. namespace is the same as the document id
// @ts-ignore
export async function DELETE(request: NextRequest, { params: { id } }) {
  // Get credentials from cookies
  const credentials = JSON.parse(
    request.cookies.get("credentials")?.value || null
  )
  if (!credentials) {
    return NextResponse.redirect("/credentials")
  }

  const {
    supabaseDatabaseUrl,
    pineconeEnvironment,
    pineconeApiKey,
    pineconeIndex,
    supabaseUrl,
    supabaseKey,
    supabaseBucket,
  } = credentials
  const prisma = createPrisma({ url: supabaseDatabaseUrl })
  const pinecone = await initPinecone(pineconeEnvironment, pineconeApiKey)

  const document = await prisma.documents.delete({
    where: {
      id,
    },
  })
  console.log("document", document)
  // delete pinecone namespace
  const index = pinecone.Index(pineconeIndex)
  await index.delete1({ deleteAll: true, namespace: id })
  // delete supabase storage file
  const supabase = supabaseClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase.storage
    .from(supabaseBucket)
    .remove([document.url])

  if (error) {
    console.log(error)
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    )
  }
  return NextResponse.json({ message: "Document deleted" })
}
