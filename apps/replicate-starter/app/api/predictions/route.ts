import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json()
  const credentials = JSON.parse(req.cookies.get("credentials")?.value || null)

  console.log("credentials", credentials)

  if (
    !credentials ||
    !credentials.openaiApiKey ||
    !credentials.replicateApiKey
  ) {
    return NextResponse.redirect("/credentials")
  }

  const replicateApiKey = credentials?.replicateApiKey

  try {
    const replicate = new Replicate({
      auth: replicateApiKey,
    })

    if (!replicateApiKey) {
      throw new Error(
        "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
      )
    }
    const prediction = await replicate.predictions.create({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffusion/versions
      version:
        "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      input: { prompt: body.prompt },
    })

    // res.end(JSON.stringify({ detail: prediction.error }))

    return new NextResponse(JSON.stringify(prediction))
  } catch (error: any) {
    console.log("error", error)
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    )
  }
}
