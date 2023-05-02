"use client"

import { Post } from "@prisma/client"
import { useState } from "react"

import Image from "next/image"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CommentItem } from "@/components/post-comment-item"
import TextareaAutosize from "react-textarea-autosize"

interface CommentSectionProps {
    post: Pick<Post, any>
}


export function CommentSection( { post }: CommentSectionProps) {
    const [isSending, setIsSending] = useState(false)

    return (
        <div className="flex gap-3 mt-5 w-full bb-1">
            <div className="flex gap-2 h-full mt-3 w-full">
              <Image
                    src={post.authorImage}
                    alt="Author Image"
                    width={30}
                    height={30}
                    className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900 mt-auto"
              />
              <TextareaAutosize
                  id="comment"
                  placeholder="Leave a comment..."
                  className="w-full resize-none appearance-none text-md focus:outline-none bb-1"
                />
            </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Send</span>
          </button>
        </div>
    )
}