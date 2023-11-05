import axios from 'axios'
import { useState, useEffect } from 'react'

export default function GenerateName({ idea }: { idea: string }) {
  const [completion, setCompletion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.post('/api/generate-name', {
          prompt: idea
        })
        setCompletion(response.data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [idea])

  const render = () => {
    if (isLoading && completion) {
      return <p>Loading...</p>
    }
    if (completion?.length) {
      return <output>Startup Name: {completion?.replace('--', '')}</output>
    }

    return null
  }

  return (
    <div className="mx-auto w-full max-w-md py-8 flex flex-col stretch">
      {render()}
    </div>
  )
}
