import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="mb-0 flex flex-col items-center justify-between gap-4 border-t border-t-slate-200 p-3 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.link className="h-5 w-5"/>
          <p className="text-center text-sm leading-loose md:text-left">
            <a
              href={siteConfig.links.about}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              About us
            </a>
            {" "} | {" "}
            <a
              href={siteConfig.links.instagram}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Instagram
            </a>
            {" "} | {" "}
            <a
              href={siteConfig.links.contactus}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Report bug
            </a>
          </p>
        </div>
        <p className="my-auto text-center text-sm md:text-left">
           Brewd 2023
        </p>
      </div>
    </footer>
  )
}
