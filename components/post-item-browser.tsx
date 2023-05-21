import Link from "next/link"
import Image from "next/image"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { PostActionButtons } from "@/components/post-action-buttons"

interface PostItemBrowserProps {
  post: any,
}

export function PostItemBrowser({ post }: PostItemBrowserProps) {

  return (
        <Link
          href={`/viewer/${post.id}`}
        >
        <div className="flex items-center justify-between p-4 mb-2 rounded-md border border-slate-200">
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
            <div className="font-semibold hover:underline">
              <span className="bg-black text-white rounded p-1 text-sm">{post.category}</span> {" " + post.title} 
            </div>
            <div>
              <p className="text-sm text-slate-600">
              <PostActionButtons key={post.id} post={post} currentUser={post.currentUser} currentUsername={post.currentUsername} liked={post.liked} likeCountValue={post.likeCount} commentCountValue={post.commentCount} />
              </p>
            </div>
          </div>
        </div>
    </Link>
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
