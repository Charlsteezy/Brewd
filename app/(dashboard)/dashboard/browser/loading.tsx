import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItemBrowser } from "@/components/post-item-browser"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
        <PostItemBrowser.Skeleton />
      </div>
    </DashboardShell>
  )
}
