import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

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
