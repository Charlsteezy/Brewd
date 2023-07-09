import Link from "next/link"
import Image from "next/image"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { PostActionButtons } from "@/components/post-action-buttons"
import { SuperstarBadge } from "@/components/ui/superstar-badge"

interface PostItemBrowserProps {
  post: any,
}


export function PostItemBrowser({ post }: PostItemBrowserProps) {


  // Convert post.blocks to string using stringify
  const data = post.content;

  const paragraphs = data.blocks
  .filter(block => block.type === "paragraph")
  .map(block => block.data.text);
  
  

  return (
        <Link
          href={`/viewer/${post.id}`}
        >
        <div className="mb-2 flex items-center justify-between border-b-[1px] border-slate-200 py-4">
          <div className="grid w-full gap-3">
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
                    className="my-auto font-semibold hover:underline"
                    >
                    <p className="text-md my-auto ml-2 text-gray-500">{post.author.name}</p>
                    </Link> 

                    {post.isASuperStar.isPro ? (
                        <p className="my-auto ml-3">
                         <SuperstarBadge />
                          </p>
                    ) : (
                      ""
                    )} 

                    <p className="my-auto ml-auto justify-end text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
            <div className="font-semibold hover:underline">
              <span className="rounded bg-black p-1 text-sm text-white">{post.category}</span> {" " + post.title} 
            </div>
            <div className="text-md w-full text-slate-600">
              <div className="w-full">
                {paragraphs.map((paragraph, index) => (
                  <p className="w-full" key={index}><div dangerouslySetInnerHTML={{ __html: paragraph }} /></p>
                ))}...
              </div>
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
    <div className="py-4">
      <div className="space-y-5">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-2/5" />
      </div>
    </div>
  )
}
