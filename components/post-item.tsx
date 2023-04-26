import Link from "next/link"
import { Post } from "@prisma/client"
import { db } from "@/lib/db"

import { formatDate } from "@/lib/utils"
import { PostOperations } from "@/components/post-operations"
import { Skeleton } from "@/components/ui/skeleton"
import { User } from "@prisma/client"

interface PostItemProps {
  post: Pick<Post, "id" | "title" | "published" | "createdAt" | "category">
}

export function PostItem({ post }: PostItemProps) {

  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${post.id}`}
          className="font-semibold hover:underline"
        >
          {"[" + post.category + "]" + " "} {post.title}
        </Link>
        <div>
          <p className="text-sm text-slate-600">
            {formatDate(post.createdAt)} <i className="text-green-900">{post.published ? "Published" : ""}{" "}</i>
          </p>
        </div>
      </div>
      <PostOperations post={{ id: post.id, title: post.title}} />
      {/* <PostDeleteButton post={{ id: post.id, title: post.title }} /> */}
    </div>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
