import { notFound } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { UserAccountNav } from "@/components/user-account-nav"
import { SiteFooter } from "@/components/site-footer"

interface EditorProps {
  children?: React.ReactNode
}

export default async function EditorLayout({ children }: EditorProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }
  return (
    <div>
      <header className="container sticky top-0 z-40 bg-white">
          <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
            <MainNav items={dashboardConfig.mainNav} />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </div>
        </header>
      <div className="container mx-auto grid items-start gap-10 py-8">
        {children}
      </div>
      <SiteFooter className="bt-1 mt-[10%]" />
    </div>
  )
}
