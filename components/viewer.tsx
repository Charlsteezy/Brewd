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
import { postPatchSchema } from "@/lib/validations/post"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { CommentItem } from "@/components/post-comment-item"
import { PostActionButtons } from "@/components/post-action-buttons"
import { CommentSection } from "@/components/post-comment-section"

interface EditorProps {
  post: any,
  currentUser: string
  currentUsername: string | null
  liked: boolean,
  likeCount: number,
  commentCount: number,
}

export const revalidate = 0

type FormData = z.infer<typeof postPatchSchema>


export function Viewer({ post, currentUser, currentUsername, liked, likeCount, commentCount }: EditorProps) {

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
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  })
  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const Code = (await import("@editorjs/code")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default


    const body = postPatchSchema.parse(post)

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
          setIsPageLoading(false)
        },
        placeholder: "Tell us more... Take us through your proccess. Make use of the tools below to format your post.",
        inlineToolbar: true,
        data: body.content,
        readOnly: true,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
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
        <div className="prose prose-stone mx-auto lg:w-[800px]">
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
                className="my-auto font-semibold hover:underline"
                >
                <p className="text-md my-auto ml-2 text-gray-500">{post.authorName}</p>
                </Link>
                
                {post.isPro ? (
                    <p className="my-auto ml-3">
                      <Image
                        src="/images/proicons/pro-stars.gif"
                        alt="Pro Badge"
                        width={30}
                        height={30}
                        loading="eager"
                        ></Image>
                      </p>
                ) : (
                    null
                )} 

                <p className="my-auto ml-auto justify-end text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            <div className="flex max-w-[100vw] gap-3 overflow-x-hidden">
              <p className="mt-0 flex appearance-none text-5xl font-bold focus:outline-none">
                  [{post.category}]
                {" "}
                  {post.title}
              </p>
            </div>
          <div id="editor" className="overflow-x-hidden"/>
          <PostActionButtons key={post.id} post={post} currentUser={currentUser} currentUsername={currentUsername} liked={liked} likeCountValue={likeCount} commentCountValue={commentCount} />
          {isPageLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (<CommentSection post={post} currentUser={currentUser} currentUsername={currentUsername} />)}
        </div>
      </div>
  )
}
