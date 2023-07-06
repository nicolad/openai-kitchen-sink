"use client"

import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"

import styles from "@/styles/Home.module.css"

import "katex/dist/katex.min.css"
// @ts-ignore
import Image from "next/image"
import Link from "next/link"
import { useCredentialsCookie } from "@/context/credentials-context"
import { Document } from "langchain/document"
import { AlertCircle, Check, Loader2, UploadCloud } from "lucide-react"
import { useDropzone } from "react-dropzone"
import ReactMarkdown from "react-markdown"
import ScrollToBottom from "react-scroll-to-bottom"

import { Message, reducer } from "@/lib/chat"
import {
  Document as SupabaseDocument,
  supabaseClient,
  uploadToSubabase,
} from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const Page = () => {
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  const [files, setFiles] = useState(null)
  const { cookieValue } = useCredentialsCookie()
  const { toast } = useToast()
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
  }, [])

  const [state, dispatch] = useReducer(reducer, {
    messages: [
      {
        name: "system",
        // text: 'Act as an expert. Use markdown, katex, remark-math and gfm syntax when applicable. wrap math expression using $$.',
        text: "Act as an expert. Reply to questions about this document. Self reflect on your answers.",
      },
    ],
    assistantThinking: false,
    isWriting: false,
    controller: null,
  })
  const [document, setDocument] = useState<SupabaseDocument>(null)
  const [publicUrl, setPublicUrl] = useState(null)
  const [query, setQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // checks if credentials are set
  const checkCredentials = () => {
    if (
      !cookieValue.openaiApiKey ||
      !cookieValue.pineconeEnvironment ||
      !cookieValue.pineconeIndex ||
      !cookieValue.pineconeApiKey ||
      !cookieValue.supabaseUrl ||
      !cookieValue.supabaseKey ||
      !cookieValue.supabaseBucket ||
      !cookieValue.supabaseDatabaseUrl ||
      !cookieValue.supabaseDirectUrl
    ) {
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    })
    let prediction = await response.json()

    // if (response.status !== 201) {
    //   setError(prediction.detail)
    //   return
    // }

    setPrediction(prediction)

    await sleep(10000)

    const res = await fetch("/api/predictions/" + prediction.id)
    prediction = await res.json()

    // if (res.status !== 200) {
    //   setError(prediction.detail)
    //   return
    // }
    setPrediction(prediction?.data)
  }

  return (
    <section className="container grid grid-cols-2 items-center gap-6 pb-8 pt-6 md:py-10">
      {!checkCredentials() && (
        <Alert className="col-span-2" variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>
              This app requires you to{" "}
              <Link
                className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                href="/credentials"
                rel="noreferrer"
              >
                add your credentials
              </Link>{" "}
              to work properly.
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div
        style={{
          flexDirection: "column",
        }}
      >
        <h1 className="py-6 text-center font-bold text-2xl">
          Dream something with{" "}
          <a href="https://replicate.com/stability-ai/stable-diffusion">
            Stable Diffusion
          </a>
        </h1>

        <form
          className="w-full flex"
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            className="flex-grow"
            name="prompt"
            placeholder="Enter a prompt to display an image"
          />
          <button className="button" type="submit">
            Go!
          </button>
        </form>

        {error && <div>{error}</div>}

        {prediction && (
          <div>
            {prediction.output && (
              <div className="image-wrapper mt-5">
                <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes="100vw"
                />
              </div>
            )}
            <p className="py-3 text-sm opacity-50">
              status: {prediction.status}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Page
