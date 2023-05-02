import { Post } from "@prisma/client";
import { Icons } from "@/components/icons";

interface PostActionButtonsProps {
    post: Pick<Post, "id" | "authorName" | "currentUser">;
}



export function PostActionButtons({ post }: PostActionButtonsProps) {

    return (
        <div className="flex gap-5">
            <button className="appearance-none"><Icons.heart /></button>
            <button className="appearance-none"><Icons.share /></button>
            {post.currentUser ? <button className="appearance-none"><Icons.star /></button> : null }
            <button className="appearance-none"><Icons.star /></button>
        </div>
    );
}