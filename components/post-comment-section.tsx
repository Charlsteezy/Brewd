"use client"

import { Post } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import Image from "next/image"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CommentItem } from "@/components/post-comment-item"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "@/hooks/use-toast"
import { postCommentSchema } from "@/lib/validations/post"
import { sendNotification } from "@/lib/sendNotification"

interface CommentSectionProps {
    post: Pick<Post, any>,
    currentUser: string
    currentUsername: string | null
}

type CommentFormData = z.infer<typeof postCommentSchema>


export function CommentSection( { post, currentUser, currentUsername }: CommentSectionProps) {

    const router = useRouter()

    const { register, handleSubmit } = useForm<CommentFormData>({
      resolver: zodResolver(postCommentSchema),
    })

    const [isSending, setIsSending] = useState(false)

    async function onSubmit(data: CommentFormData) {

      const commentBoxReset = document.getElementById("comment") as HTMLInputElement

      setIsSending(true)
  
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data.comment,
          postId: post.id,
        }),
      })
  
      setIsSending(false)
  
      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Your comment was not posted. Please try again.",
          variant: "destructive",
        })
      }

      router.refresh()

      commentBoxReset.value = ""

      const notificationTitle = currentUsername + " commented on your post!";

      const notificationMessage = currentUsername + " commented on your post " + post.title + ", head over to see what they said.";


      if(post.authorId != currentUser){
      sendNotification(post.authorId, notificationTitle, notificationMessage, post.id)
      }
  
      return toast({
        description: "Your comment was successfully posted.",
      })
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3 mt-10 w-full bb-1">
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
                  {...register("comment")}
                />
            </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Send</span>
          </button>
        </div>
      </form>
    )
}