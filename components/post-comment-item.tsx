import Link from "next/link"
import Image from "next/image"

import { Icons } from "@/components/icons"



export function CommentItem() {
    return (
    <div>
        <div className="prose prose-stone mt-auto mx-auto w-full">
            <div className="flex w-full">  
                <Image
                  src="https://s.gravatar.com/avatar/a4c6296f995682f254e7c8715fe87b23?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fch.png"
                  alt="Author Image"
                  width={30}
                  height={30}
                  className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
                />

                <Link
                href={`/profile`}
                className="font-semibold hover:underline my-auto"
                >
                <p className="text-md text-gray-500 my-auto ml-2">Charlie</p>
                </Link>

                <p className="text-xs text-gray-500 my-auto justify-end ml-auto">19/2/22</p>
            </div>
        </div>
        <p className="text-md text-gray-500 my-auto">This is a comment</p>
        <div className="flex gap-5 justify-end w-full">
            <button className="w-15 appearance-none"><Icons.heart /></button>
            <button className="w-15 appearance-none"><Icons.reply /></button>
        </div>
    </div>
    )
}