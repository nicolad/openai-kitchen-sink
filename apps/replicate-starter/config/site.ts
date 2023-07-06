export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "PDF Chat",
  description:
    "Chat with any pdf file, powered by Langchain, Pinecone, Supabase and OpenAI",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Credentials",
      href: "/credentials",
    },
  ],
  links: {
    github: "https://github.com/anis-marrouchi/chatpdf-gpt",
  },
}
