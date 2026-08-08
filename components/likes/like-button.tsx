"use client";

import { useActionState } from "react";
import { toggleLike, type LikeFormState } from "@/lib/likes/actions";

const initialState: LikeFormState = {};

export default function LikeButton({
  postId,
  isLiked,
  likeCount,
}: {
  postId: string;
  isLiked: boolean;
  likeCount: number;
}) {
  const [state, formAction, isPending] = useActionState<LikeFormState, FormData>(
    toggleLike,
    initialState,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        disabled={isPending}
        aria-pressed={isLiked}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          isLiked
            ? "text-red-600 dark:text-red-500"
            : "text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
        }`}
      >
        <HeartIcon filled={isLiked} />
        {isLiked ? "Liked" : "Like"}
      </button>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
      {state.error ? (
        <span className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
