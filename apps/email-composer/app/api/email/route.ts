import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import type { SentMessageInfo } from 'nodemailer'

type Data = {
  [key: string]: string | boolean | string[]
}

export async function POST(req: NextRequest) {
  try {
    const { body, subject } = await req.json()
    const html = body.replace(/\n/g, '<br>')

    const transporter = nodemailer.createTransport({
      // host: process.env.MAILER_HOST,
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD
      }
    })

    const info: SentMessageInfo = await transporter.sendMail({
      // from: email as string,
      from: 'nicolai.vadim@gmail.com',
      to: 'nicolai.vadim@gmail.com',
      subject: subject,
      html
    })

    if (info.messageId) {
      return NextResponse.json(
        'Thanks for subscribing! Please check your email',
        { status: 200 }
      )
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
