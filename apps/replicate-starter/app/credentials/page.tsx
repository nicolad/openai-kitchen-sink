"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useCredentialsCookie } from "@/context/credentials-context"
import { Button, Input } from "antd"
import { Controller, useForm } from "react-hook-form"

export default function CredentialsPage() {
  const { cookieValue, setAndSaveCookieValue } = useCredentialsCookie()
  const { handleSubmit, control, setValue, getValues } = useForm()

  useEffect(() => {
    if (cookieValue) {
      const { openaiApiKey, replicateApiKey } = cookieValue
      setValue("openaiApiKey", openaiApiKey)
      setValue("replicateApiKey", replicateApiKey)
    }
  }, [cookieValue, setValue])

  const handleSaveCredentials = () => {
    setAndSaveCookieValue({
      openaiApiKey: getValues("openaiApiKey"),
      replicateApiKey: getValues("replicateApiKey"),
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

        <form
          onSubmit={handleSubmit(handleSaveCredentials)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            gap: "1rem",
          }}
        >
          <Controller
            name="openaiApiKey"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input.Password
                {...field}
                addonBefore="OpenAI API Key"
                placeholder="sk-***************************"
                style={{ width: 500 }}
              />
            )}
          />
          <Controller
            name="replicateApiKey"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input.Password
                {...field}
                addonBefore="Replicate API Key"
                style={{ width: 500 }}
              />
            )}
          />
          <Button type="primary" htmlType="submit">
            Save Credentials
          </Button>
        </form>
      </div>
    </section>
  )
}
