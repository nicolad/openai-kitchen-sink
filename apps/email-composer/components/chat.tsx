'use client'

import { useChat, type Message } from 'ai/react'
import axios from 'axios' // import axios library

import { cn } from '@/lib/utils'
import { ChatPanel } from '@/components/chat-panel'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const [emailContext, setEmailContext] = useState('') // For storing the email context
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [recipientName, setRecipientName] = useState('')

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      }
    })

  const lastMessage = messages?.[messages?.length - 1]

  useEffect(() => {
    try {
      const content = JSON.parse(lastMessage?.content ?? '{}')
      const { subject, body } = content
      setEmailSubject(subject)
      setEmailBody(body)
    } catch (error) {
      console.error(error)
    }
  }, [lastMessage])

  const handleSendEmail = useCallback(async () => {
    try {
      const response = await axios.post('/api/email', {
        subject: emailSubject,
        body: emailBody,
        recipientName
      })
      if (response.status === 200) {
        toast.success('Email sent successfully')
      }
    } catch (error) {
      toast.error('There was an error sending the email')
    }
  }, [emailSubject, emailBody, recipientName])

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        <div className="flex my-4 mx-8">
          <div className="flex-1 mr-2">
            <textarea
              className="w-full h-48 p-2 border rounded"
              placeholder="Context"
              value={emailContext}
              onChange={e => setEmailContext(e.target.value)}
            ></textarea>
            <input
              className="w-full p-2 border rounded mb-2"
              type="text"
              placeholder="Recipient Name"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
            />

            <ChatPanel
              id={id}
              emailContext={emailContext}
              recipientName={recipientName}
              isLoading={isLoading}
              stop={stop}
              append={append}
              reload={reload}
              messages={messages}
              input={input}
              setInput={setInput}
            />
          </div>
          <div className="flex-1">
            <div>
              <input
                className="w-full p-2 border rounded mb-2"
                type="text"
                placeholder="Email Subject"
                value={emailSubject}
                onChange={e => setEmailSubject(e.target.value)}
              />
              <textarea
                className="w-full h-32 p-2 border rounded"
                placeholder="Email Body"
                value={emailBody}
                onChange={e => setEmailBody(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSendEmail}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
