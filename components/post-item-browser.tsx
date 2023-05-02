import Link from "next/link"
import { PostForBrowser } from "@prisma/client"
import Image from "next/image"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PostItemBrowserProps {
  post: Pick<PostForBrowser, any>,
}

export function PostItemBrowser({ post }: PostItemBrowserProps) {

  return (
    <div className="flex items-center justify-between p-4 mb-2">
      <div className="grid gap-3 w-full">
            <div className="flex w-full">  
                <Image
                  src={post.author.image}
                  alt="Author Image"
                  width={30}
                  height={30}
                  className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
                />

                <Link
                href={`/profile/${post.author.name}}`}
                className="font-semibold hover:underline my-auto"
                >
                <p className="text-md text-gray-500 my-auto ml-2">{post.author.name}</p>
                </Link> 

                {post.isASuperStar.isPro ? (
                    <p className="ml-3 my-auto">
                      <Image
                        src="/images/proicons/pro-stars.gif"
                        alt="Pro Badge"
                        width={30}
                        height={30}
                        loading="eager"
                        ></Image>
                      </p>
                ) : (
                   ""
                )} 

                <p className="text-xs text-gray-500 my-auto justify-end ml-auto">{formatDate(post.createdAt)}</p>
            </div>
        <Link
          href={`/viewer/${post.id}`}
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
    </div>
  )
}

PostItemBrowser.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
