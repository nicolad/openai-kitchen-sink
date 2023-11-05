import { StreamingTextResponse, CohereStream } from 'ai'

export const runtime = 'edge'

const base_idea_prompt = `This program generates a startup idea given the industry.

Industry: Workplace
Startup Idea: A platform that generates slide deck contents automatically based on a given outline

--
Industry: Home Decor
Startup Idea: An app that calculates the best position of your indoor plants for your apartment

--
Industry: Healthcare
Startup Idea: A hearing aid for the elderly that automatically adjusts its levels and with a battery lasting a whole week

--
Industry: Education
Startup Idea: An online primary school that lets students mix and match their own curriculum based on their interests and goals

--
Industry:`

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const body = JSON.stringify({
    prompt: base_idea_prompt + ' ' + prompt + '\nStartup Idea: ',
    model: 'xlarge',
    max_tokens: 50,
    temperature: 0.9,
    k: 0,
    p: 0.7,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
    stop_sequences: [],
    return_likelihoods: 'NONE',
    stream: true
  })

  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`
    },
    body
  })

  // Check for errors
  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status
    })
  }

  // Extract the text response from the Cohere stream
  const stream = CohereStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
