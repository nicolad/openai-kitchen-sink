"use client"

import React, { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useCredentialsCookie } from "@/context/credentials-context"
import { Button, Input } from "antd"

import { Label } from "@/components/ui/label"

export default function CredentialsPage() {
  const { cookieValue, setAndSaveCookieValue } = useCredentialsCookie()
  const [openaiApiKey, setOpenaiApiKey] = useState(cookieValue.openaiApiKey)
  const [pineconeEnvironment, setPineconeEnvironment] = useState(
    cookieValue.pineconeEnvironment
  )
  const [pineconeIndex, setPineconeIndex] = useState(cookieValue.pineconeIndex)
  const [pineconeApiKey, setPineconeApiKey] = useState(
    cookieValue.pineconeApiKey
  )
  const [supabaseKey, setSupabaseKey] = useState(cookieValue.supabaseKey)
  const [supabaseUrl, setSupabaseUrl] = useState(cookieValue.supabaseUrl)
  const [supabaseDatabaseUrl, setSupabaseDatabaseUrl] = useState(
    cookieValue.supabaseDatabaseUrl
  )
  const [supabaseDirectUrl, setSupabaseDirectUrl] = useState(
    cookieValue.supabaseDirectUrl
  )

  const [supabaseBucket, setSupabaseBucket] = useState(
    cookieValue.supabaseBucket
  )

  console.log("cookieValue", cookieValue)

  const handleOpenaiApiKeyChange = (e) => {
    setOpenaiApiKey(e.target.value)
  }
  const handlePineconeEnvironmentChange = (e) => {
    setPineconeEnvironment(e.target.value)
  }
  const handlePineconeIndexChange = (e) => {
    setPineconeIndex(e.target.value)
  }
  const handlePineconeApiKeyChange = (e) => {
    setPineconeApiKey(e.target.value)
  }
  const handleSupabaseKeyChange = (e) => {
    setSupabaseKey(e.target.value)
  }
  const handleSupabaseUrlChange = (e) => {
    setSupabaseUrl(e.target.value)
  }
  const handleSupabaseBucketChange = (e) => {
    setSupabaseBucket(e.target.value)
  }
  const handleSupabaseDatabaseUrlChange = (e) => {
    setSupabaseDatabaseUrl(e.target.value)
  }
  const handleSupabaseDirectUrlChange = (e) => {
    setSupabaseDirectUrl(e.target.value)
  }

  const handleSaveCredentials = () => {
    setAndSaveCookieValue({
      openaiApiKey,
      pineconeEnvironment,
      pineconeIndex,
      pineconeApiKey,
      supabaseKey,
      supabaseUrl,
      supabaseBucket,
      supabaseDatabaseUrl,
      supabaseDirectUrl,
    })
  }

  return (
    <section className="container flex justify-items-stretch gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-start gap-2 ">
        <h2 className="mt-10 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Manage your API credentials
        </h2>

        <div>
          <h3 className="mt-10 scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
            Getting Started
          </h3>
          <p>
            This app requires API credentials to work. You can get these
            credentials from{" "}
            <Link
              className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noreferrer"
            >
              Open AI
            </Link>{" "}
            ,{" "}
            <Link
              className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
              href="https://app.pinecone.io/"
              target="_blank"
              rel="noreferrer"
            >
              Pinecone
            </Link>{" "}
            and{" "}
            <Link
              className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
              href="https://app.supabase.io/"
              target="_blank"
              rel="noreferrer"
            >
              Supabase
            </Link>
          </p>
          <p>
            Once you have the credentials, you can add them to this app by
            clicking on the &quot;Add Credentials&quot; button above.
          </p>
        </div>
        <div>
          <h3 className="mt-10 scroll-m-20 pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0">
            How do I get my credentials?
          </h3>
          <ol className="p-4">
            <li>
              1. Create your{" "}
              <Link
                className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                OpenAI API key
              </Link>
            </li>
          </ol>
        </div>

        <Label htmlFor="openai-api-key" className="text-right">
          OpenAI API Key
        </Label>

        <Input.Password
          value={openaiApiKey}
          defaultValue={openaiApiKey}
          placeholder="sk-***************************"
          onChange={handleOpenaiApiKeyChange}
        />

        <Button type="primary" onClick={handleSaveCredentials}>
          Save Credentials
        </Button>
      </div>
    </section>
  )
}
