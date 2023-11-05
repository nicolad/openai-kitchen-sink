'use client'

import { useCompletion } from 'ai/react'
import GenerateName from './GenerateName'

export default function GenerateIdea() {
  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    error
  } = useCompletion({
    api: '/api/generate-idea'
  })

  const ideas = completion?.split('Startup Idea:')

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-8">
        <label className="grow">
          <input
            className="w-full max-w-md bottom-0 border border-gray-300 rounded shadow-xl p-2"
            value={input}
            onChange={handleInputChange}
            placeholder="Industry, technology, or problem"
          />
        </label>
        <button
          disabled={isLoading}
          type="submit"
          className={`font-bold py-2 px-4 rounded text-white ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Loading...' : 'Generate Idea'}
        </button>
      </form>
      <output>
        {error && <p>{error?.message}</p>}
        {ideas.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'monospace',
              fontSize: '1rem',
              margin: '0 0 2rem 0'
            }}
          >
            {line?.split('--')?.[0]}
            {!isLoading && completion?.length > 0 && (
              <GenerateName idea={line} />
            )}
            {i < ideas.length - 1 && (
              <span
                style={{
                  color: 'green',
                  border: '1px solid green',
                  display: 'block',
                  padding: '0 0.5rem'
                }}
              />
            )}
          </p>
        ))}
      </output>
    </div>
  )
}
