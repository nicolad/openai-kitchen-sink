import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: Request) {
  const { content } = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const stream = openai.beta.chat.completions.stream({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [{ role: 'user', content }]
  })

  return new Response(stream.toReadableStream())
}
