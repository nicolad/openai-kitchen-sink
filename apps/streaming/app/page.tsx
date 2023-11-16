'use client'
import React, { useState } from 'react'

const Chat = () => {
  const [inputText, setInputText] = useState('')
  const [responseText, setResponseText] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content: inputText }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const reader = response?.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        if (!reader) break

        const { done, value } = await reader.read()

        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line) {
            const json = JSON.parse(line)
            if (json?.choices?.[0]?.delta?.content) {
              setResponseText(prev => prev + json.choices[0].delta.content)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setResponseText('An error occurred.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="border border-gray-300 p-2 w-full"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask something..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Submit
        </button>
      </form>
      {responseText && (
        <div className="response p-4 rounded border border-gray-300">
          <p style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>
            {responseText}
          </p>
        </div>
      )}
    </div>
  )
}

export default Chat
