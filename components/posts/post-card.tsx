import { deletePost } from "@/lib/posts/actions";
import LikeButton from "@/components/likes/like-button";
import CommentForm from "@/components/comments/comment-form";
import CommentList, { type PostComment } from "@/components/comments/comment-list";
import Timestamp from "@/components/timestamp";

export type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { username: string } | null;
  likes: { user_id: string }[];
  comments: PostComment[];
};

export default function PostCard({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId: string;
}) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-black/20">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {post.profiles?.username ?? "Unknown"}
        </p>
        <div className="flex items-center gap-3">
          <Timestamp
            date={post.created_at}
            className="text-sm text-zinc-500 dark:text-zinc-400"
          />
          {post.user_id === currentUserId ? (
            <form action={deletePost}>
              <input type="hidden" name="postId" value={post.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </form>
          ) : null}
        </div>
      </div>
      <p className="mt-3 break-words whitespace-pre-wrap leading-relaxed text-zinc-900 dark:text-zinc-50">
        {post.content}
      </p>
      <div className="mt-4">
        <LikeButton
          postId={post.id}
          isLiked={post.likes.some((like) => like.user_id === currentUserId)}
          likeCount={post.likes.length}
        />
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-2 dark:border-zinc-800">
        <CommentList comments={post.comments} currentUserId={currentUserId} />
        <CommentForm postId={post.id} />
      </div>
    </article>
  );
}
