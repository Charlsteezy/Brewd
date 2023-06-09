import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItemBrowser } from "@/components/post-item-browser"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Browse posts" text="Bear with us, fetching latest posts...">
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-y divide-neutral-200 border-b-[1px] border-slate-200 pb-2">
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
      </div>
    </DashboardShell>
  )
}
