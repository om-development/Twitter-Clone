import { deletePost } from "@/lib/posts/actions";
import { deleteComment } from "@/lib/comments/actions";
import LikeButton from "@/components/likes/like-button";
import CommentForm from "@/components/comments/comment-form";

export type PostComment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { username: string } | null;
};

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
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {post.profiles?.username ?? "Unknown"}
        </p>
        <div className="flex items-center gap-3">
          <time className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date(post.created_at).toLocaleString()}
          </time>
          {post.user_id === currentUserId ? (
            <form action={deletePost}>
              <input type="hidden" name="postId" value={post.id} />
              <button
                type="submit"
                className="text-sm text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

      <div className="mt-5 flex flex-col gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {comment.profiles?.username ?? "Unknown"}
              </span>
              <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                {comment.content}
              </p>
              <time className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                {new Date(comment.created_at).toLocaleString()}
              </time>
            </div>
            {comment.user_id === currentUserId ? (
              <form action={deleteComment}>
                <input type="hidden" name="commentId" value={comment.id} />
                <button
                  type="submit"
                  className="text-xs text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </form>
            ) : null}
          </div>
        ))}
        <CommentForm postId={post.id} />
      </div>
    </article>
  );
}
