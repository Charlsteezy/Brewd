"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post } from "@prisma/client"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"
import { formatDate } from "@/lib/utils"
import  Image from "next/image"
import Select from "react-select";
import { useState } from "react";

import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

interface EditorProps {
  post: any,
}

type FormData = z.infer<typeof postPatchSchema>


export function Editor({ post }: EditorProps) {

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
        },
        placeholder: "Tell us more... Take us through your proccess. Make use of the tools below to format your post.",
        inlineToolbar: true,
        data: body.content,
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

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const blocks = await ref.current?.save()

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
        category: selectedOption.value,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your post has been saved.",
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="xs:max-w-xs flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-slate-600">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Publish</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto">
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
                    <p className="text-md my-auto ml-3 bg-gray-900 text-gray-500">FREE</p>
                )} 

                <p className="my-auto ml-auto justify-end text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            {post.category != "none" ? (<div><p className="rounded bg-green-200 p-1 text-xs">{post.category}</p></div>) : ("")}
            <div className="flex gap-2">
              <Select
                id="category"
                placeholder="Category"
                defaultValue={selectedOption}
                value={selectedOption}
                onChange={setSelectedOption}
                options={choices}
                required={true}
                className="z-10 my-auto w-1/4"
              />
              <TextareaAutosize
                autoFocus
                id="title"
                defaultValue={post.title}
                placeholder="What's on your mind?"
                className="w-full resize-none appearance-none overflow-hidden text-5xl font-bold focus:outline-none"
                {...register("title")}
              />
            </div>
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-slate-50 px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  )
}
