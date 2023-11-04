import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { JsonOutputFunctionsParser } from 'langchain/output_parsers'

export const runtime = 'edge'

const TEMPLATE = `Extract the requested fields from the input.

The field "entity" refers to the first mentioned entity in the input.

Write a short email

in the [Your Name] field, write "Vadim Nicolai"

Input:

{input}`

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    try {
      const { input, context } = body ? JSON.parse(body ?? {}) : ''

      console.log({ input, context })
    } catch (e) {
      console.log(e)
    }

    const messages = body.messages ?? []
    const currentMessageContent = messages[messages.length - 1].content

    const prompt = PromptTemplate.fromTemplate(TEMPLATE)
    /**
     * Function calling is currently only supported with ChatOpenAI models
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: 'gpt-4',
      openAIApiKey: process.env.OPENAI_API_KEY
    })

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON Schema directly if desired.
     */
    const schema = z.object({
      subject: z.string().describe('Email subject'),
      body: z.string().describe('Email body')
    })

    /**
     * Bind the function and schema to the OpenAI model.
     * Future invocations of the returned model will always use these arguments.
     *
     * Specifying "function_call" ensures that the provided function will always
     * be called by the model.
     */
    const functionCallingModel = model.bind({
      functions: [
        {
          name: 'output_formatter',
          description: 'Should always be used to properly format output',
          parameters: zodToJsonSchema(schema)
        }
      ],
      function_call: { name: 'output_formatter' }
    })

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt
      .pipe(functionCallingModel)
      .pipe(new JsonOutputFunctionsParser())

    const result = await chain.invoke({
      input: currentMessageContent
    })

    return NextResponse.json(result, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
