import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { UserAccountNav } from "@/components/user-account-nav"

interface EditorProps {
  children?: React.ReactNode
}

export default async function EditorLayout({ children }: EditorProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }
  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      {children}
    </div>
  )
}
