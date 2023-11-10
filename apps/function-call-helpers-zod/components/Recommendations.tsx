'use client'

import React, { useState } from 'react'
import axios from 'axios'

export default function Recommendations() {
  const [selectedBook, setSelectedBook] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const bookTitles = [
    {
      id: 1,

      title: 'To Kill a Mockingbird'
    },
    {
      id: 2,
      title: 'All the Light We Cannot See'
    },
    {
      id: 3,
      title: 'Where the Crawdads Sing'
    }
  ]

  const handleBookChange = (e: any) => {
    setSelectedBook(e.target.value)
  }

  const handleApiCall = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post('/api/function-call-helpers', {
        book: selectedBook
      })
      const response = res?.data?.result?.choices?.[0]?.message?.content
      setResponse(response)
      return
      setResponse(res.data)
    } catch (err) {
      setResponse('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
      <form className="flex flex-col gap-3 mb-8">
        <select
          value={selectedBook}
          onChange={handleBookChange}
          className="border border-gray-300 rounded shadow-xl p-2 mb-4"
        >
          <option value="">Select a Book</option>
          {bookTitles.map((book, index) => (
            <option key={index} value={book.title}>
              {book.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleApiCall}
          disabled={isLoading}
          className={`font-bold py-2 px-4 rounded text-white ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Loading...' : 'Get Recommendation'}
        </button>
      </form>
      <output>{response && <p>{response}</p>}</output>
    </div>
  )
}
