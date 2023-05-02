"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formatDate } from "@/lib/utils"
import  Image from "next/image"
import { useState } from "react";
import { PostActionButtons } from "@/components/post-action-buttons"
import { CommentSection } from "@/components/post-comment-section"

import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { CommentItem } from "@/components/post-comment-item"

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published" | "authorName" | "authorImage" | "createdAt"  | "category" | "isPro" | "currentUser">
}

type FormData = z.infer<typeof postPatchSchema>


export function Viewer({ post }: EditorProps) {

  const choices = [
    { value: 'Recipe', label: 'Recipe' },
    { value: 'Brew guide', label: 'Brew guide' },
    { value: 'Question', label: 'Question' },
    { value: 'Tech', label: 'Tech' },
    { value: 'Announcement', label: 'Announcement' },
    { value: 'Video', label: 'Video' },
    { value: 'Review', label: 'Review' },
  ];
  
  const [selectedOption, setSelectedOption] = useState({ value: post.category, label: post.category });

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  })
  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default


    const body = postPatchSchema.parse(post)

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Tell us more... Take us through your proccess. Make use of the tools below to format your post.",
        inlineToolbar: true,
        data: body.content,
        readOnly: true,
        tools: {
        },
      })
    }
  }, [post])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  if (!isMounted) {
    return null
  }

  return (
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard/browser"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
          </div>
          <button type="submit" className="appearance-none">
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span className="flex gap-2"><Icons.save /> Save post</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto w-[800px]">
            <div className="flex w-full">  
                <Image
                  src={post.authorImage}
                  alt="Author Image"
                  width={30}
                  height={30}
                  className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
                />

                <Link
                href={`/profile/${post.authorName}}`}
                className="font-semibold hover:underline my-auto"
                >
                <p className="text-md text-gray-500 my-auto ml-2">{post.authorName}</p>
                </Link>
                
                {post.isPro ? (
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
                    <p className="text-md text-gray-500 my-auto ml-3 bg-gray-900">FREE</p>
                )} 

                <p className="text-xs text-gray-500 my-auto justify-end ml-auto">{formatDate(post.createdAt)}</p>
            </div>
            <div className="flex gap-3">
              <p className="mt-0 appearance-none text-5xl font-bold focus:outline-none flex">
                  [{post.category}]
                {" "}
                  {post.title}
              </p>
            </div>
          <div id="editor" className="min-h-fit-content" />
          <PostActionButtons key={post.id} post={post} />
          <CommentSection post={post} />
          <CommentItem />
        </div>
      </div>
  )
}
