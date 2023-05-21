"use client"

import { Post } from "@prisma/client";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { sendNotification } from "@/lib/sendNotification";
import { toast } from "@/hooks/use-toast"
import { revalidatePath } from 'next/cache';

interface PostActionButtonsProps {
    post: {id: string, title: string, content: string, published: string, authorName: string, authorImage: string, authorId: string, createdAt: string, category: string, isPro: string, currentUser: string},
    currentUser: string
    currentUsername: string | null
    liked: boolean,
    likeCountValue: number,
    commentCountValue: number
}

export function PostActionButtons({ post, currentUser, currentUsername, liked, likeCountValue, commentCountValue }: PostActionButtonsProps) {

    const [isLiked, setIsLiked] = useState(liked);
    const [likeCount, setLikeCount] = useState(likeCountValue);
    const [commentCount, setCommentCount] = useState(commentCountValue);

    async function registerLike(postId, authorId, likedBy) {
        const response = await fetch("/api/posts/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: postId,
                authorId: authorId,
                likedBy: likedBy,
            }),
        })

            if (!response?.ok) {
            unlikePost()
            return toast({
              title: "Something went wrong.",
              description: "Unable to like this post, try again later.",
              variant: "destructive",
            })
          }
    }

    function likePost () {

        const notificationTitle = "First like on post '" + post.title + "'!";

        const notificationMessage = "Your post " + post.title + " was liked by" + " " + currentUsername;

        setIsLiked(true)

        console.log(post.id, post.authorId, currentUser)

        const addLike = likeCount + 1;

        setLikeCount(addLike);

        registerLike(post.id, post.authorId, currentUser);
        
        sendNotification(post.authorId, notificationTitle, notificationMessage, post.id)
    }

    function unlikePost () {
        setIsLiked(false);

        console.log("Post unliked")

        const removeLike = likeCount - 1

        setLikeCount(removeLike)
    }


    return (
        <div className="flex gap-7">
                <div className="flex gap-2">
                    {!isLiked ? (<button onClick={likePost} className="appearance-none" title="Show some love"><Icons.heart /></button>)
                     : (<button onClick={unlikePost} className="appearance-none" title="Show some love"><Icons.heart className="fill-red-500 text-red-500" /></button>)}
                     {likeCount != 0 ? (<span className="text-lg font-semibold">{likeCount}</span>) : null}
                </div>
                <div className="flex gap-2">  
                    <button className="appearance-none" title="Comment on post"><Icons.comment /></button>
                    {commentCount != 0 ? (<span className="text-lg font-semibold">{commentCount}</span>) : null}
                </div>

            {post.currentUser ? <button className="appearance-none" title="Superstar like this post!"><Icons.star /></button> : null }
            <button className="ml-auto appearance-none justify-end" title="Share post"><Icons.share /></button>
        </div>
    );
}